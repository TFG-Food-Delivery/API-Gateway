import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { CartItem } from '../types';
import { User } from 'src/common/types';

@Injectable()
export class CustomerCompositionService {
  private readonly LOGGER = new Logger('CustomerCompositionService');
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async getCustomerData(customerId: string) {
    // Paso 1: Obtener los items del carrito

    const user: User = await firstValueFrom(
      this.client.send('findUser', { id: customerId }),
    ).catch((error) => {});

    if (!user) {
      return null;
    }

    const customerData = await firstValueFrom(
      this.client.send('findOneCustomer', { id: user.id }),
    );
    const customerUserData = { ...user, ...customerData };

    return customerUserData;
  }

  /**
   * Retrieves the cart items for a given customer along with detailed information about each dish.
   *
   * @param customerId - The ID of the customer whose cart items are to be retrieved.
   * @param paginationDto - The pagination details for fetching the dish information.
   * @returns An object containing the restaurant ID and an array of cart items with detailed dish information.
   *
   * The returned object has the following structure:
   * - restaurantId: The ID of the restaurant associated with the cart items.
   * - cart: An array of cart items, each containing:
   *   - dishId: The ID of the dish.
   *   - quantity: The quantity of the dish in the cart.
   *   - name: The name of the dish.
   *   - image: The image URL of the dish.
   *   - price: The price of the dish.
   */
  async getCartWithDishDetails(
    customerId: string,
    paginationDto: PaginationDto,
  ) {
    // Paso 1: Obtener los items del carrito

    const cartItems: CartItem[] = await firstValueFrom(
      this.client.send('findCustomerCart', { id: customerId }),
    );

    if (cartItems.length === 0) {
      return {
        restaurantId: null,
        cart: [],
      };
    }
    const dishesIds = cartItems.map((item) => item.dishId);

    const { data: dishesData } = await firstValueFrom(
      this.client.send('findAllDishesInArray', { dishesIds, paginationDto }),
    );
    const { restaurantId, cart: dishes } = dishesData;

    const cartWithDetails = cartItems.map((item) => {
      const dish = dishes.find((d) => d.id === item.dishId);

      return {
        ...item,
        name: dish?.name,
        image: dish?.image,
        price: dish?.price,
      };
    });

    return {
      restaurantId,
      cart: cartWithDetails,
    };
  }
}
