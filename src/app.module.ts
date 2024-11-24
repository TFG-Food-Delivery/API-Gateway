import { Module } from '@nestjs/common';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RestaurantsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
