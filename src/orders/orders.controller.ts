import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError } from 'rxjs';
import { UpdateOrderStatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get()
  findAllOrders(@Query() paginationDto: PaginationDto) {
    return this.client.send('findAllOrders', paginationDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('/pending/:restaurantId')
  findAllRestaurantPendingOrders(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client
      .send('findAllRestaurantPendingOrders', { restaurantId, paginationDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get('/completed/:restaurantId')
  findAllRestaurantCompletedOrders(
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client
      .send('findAllRestaurantCompletedOrders', { restaurantId, paginationDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get('/pending')
  findAllPendingOrders(@Query() paginationDto: PaginationDto) {
    return this.client.send('findAllPendingOrders', { paginationDto }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('/customers/:customerId')
  findAllCustomerOrders(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.client
      .send('findAllCustomerOrders', { customerId, paginationDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Get(':id')
  findOneOrder(@Param('id') id: string) {
    return this.client.send('findOneOrder', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.client
      .send('updateOrderStatus', { orderId: id, ...updateOrderStatusDto })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Patch(':id/courier/accept')
  courierAssigned(
    @Param('id') id: string,
    @Body('courierId') courierId: string,
  ) {
    return this.client.send('courierAssigned', { orderId: id, courierId }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Post('/verify/:id')
  verifyOrderPin(@Param('id') id: string, @Body('pin') pin: string) {
    return this.client.send('verifyOrderPin', { orderId: id, pin }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Delete(':id')
  removeOrder(@Param('id') id: string) {
    return this.client.send('removeOrder', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
