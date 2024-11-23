import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
  Query,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import {
  CreateDishDto,
  CreateMenuDto,
  CreateRestaurantDto,
  RestaurantPaginationDto,
  UpdateDishDto,
  UpdateRestaurantDto,
} from './dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  private readonly LOGGER = new Logger('RestaurantsController-GW');

  /* -------------------------------------------------------------------------- */
  /*                                 Restaurant                                 */
  /* -------------------------------------------------------------------------- */
  @Post()
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.client.send('createRestaurant', createRestaurantDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('/:id')
  createRestaurantMenu(
    @Param('id') id: string,
    @Body() createMenuDto: CreateMenuDto,
  ) {
    return this.client
      .send('createRestaurantMenu', { id, ...createMenuDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get()
  findAllRestaurants(
    @Query() restaurantPaginationDto: RestaurantPaginationDto,
  ) {
    this.LOGGER.log('findAll');
    return this.client.send('findAllRestaurants', restaurantPaginationDto);
  }

  @Get(':id')
  findOneRestaurant(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneRestaurant', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id')
  patchRestaurant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.client
      .send('updateRestaurant', { id, ...updateRestaurantDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Delete(':id')
  removeRestaurant(@Param('id') id: string) {
    return this.client.send('removeRestaurant', +id).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Dish                                    */
  /* -------------------------------------------------------------------------- */

  @Post('/:id/menu')
  createDish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createDishDto: CreateDishDto,
  ) {
    return this.client.send('createDish', { id, ...createDishDto }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Get(':id/menu')
  findAllDishes(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client.send('findAllDishes', { id, paginationDto }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Get('/menu/:dishId')
  findOneDish(@Param('dishId', ParseUUIDPipe) dishId: string) {
    return this.client.send('findOneDish', { dishId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Patch('/menu/:dishId')
  updateDish(
    @Param('dishId', ParseUUIDPipe) dishId: string,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    this.LOGGER.log('Updated dish000');
    return this.client.send('updateDish', { dishId, ...updateDishDto }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete('/menu/:dishId')
  deleteDish(@Param('dishId', ParseUUIDPipe) dishId: string) {
    return this.client.send('deleteDish', { dishId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
