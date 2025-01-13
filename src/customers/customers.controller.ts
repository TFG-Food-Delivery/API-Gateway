import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import {
  CreateCustomerDto,
  CustomerEmailDto,
  UpdateCartDto,
  UpdateCustomerDto,
} from './dto';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CustomerCompositionService } from './queries';

@Controller('customers')
export class CustomersController {
  private readonly LOGGER = new Logger('CustomerGatewayController');
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly customerCompositionService: CustomerCompositionService,
  ) {}

  @Post()
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.client.send('createCustomer', createCustomerDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('/by-email')
  findOneCustomerByEmail(@Query() customerEmailDto: CustomerEmailDto) {
    const LOGGER = new Logger('CustomerController');
    LOGGER.log('findOneCustomerByEmail');

    return this.client.send('findOneCustomerByEmail', customerEmailDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':id')
  findOneCustomer(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerCompositionService.getCustomerData(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/cart')
  async findCustomerCart(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.customerCompositionService.getCartWithDishDetails(
      id,
      paginationDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id/cart-simple')
  findCustomerCartSimple(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findCustomerCart', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Post(':id/cart')
  addToCart(
    @Param('id', ParseUUIDPipe) customerId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.client.send('addToCart', { id: customerId, ...updateCartDto });
  }
  @Delete(':id/cart')
  removeFromCart(
    @Param('id', ParseUUIDPipe) customerId: string,
    @Query('dishId', ParseUUIDPipe) dishId: string,
  ) {
    return this.client.send('removeFromCart', {
      id: customerId,
      dishId,
    });
  }

  @Delete(':id/cart/restart')
  restartCart(@Param('id', ParseUUIDPipe) customerId: string) {
    return this.client.send('restartCart', {
      customerId,
    });
  }

  @Get()
  findAllCustomers(@Query() paginationDto: PaginationDto) {
    return this.client.send('findAllCustomers', paginationDto);
  }

  @Patch(':id')
  updateCustomer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    this.LOGGER.log(`Updating customer with ID ${id}`, {
      id,
      ...updateCustomerDto,
    });

    const payload = {
      id: id,
      user: updateCustomerDto.user,
      address: updateCustomerDto.address,
    };

    return this.client.emit('updateCustomer', { id, ...updateCustomerDto });
  }
}
