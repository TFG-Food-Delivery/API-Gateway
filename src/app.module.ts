import { Module } from '@nestjs/common';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { CouriersModule } from './couriers/couriers.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [RestaurantsModule, AuthModule, CustomersModule, CouriersModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
