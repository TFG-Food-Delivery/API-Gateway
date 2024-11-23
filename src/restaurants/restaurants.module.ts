import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [RestaurantsController],
  providers: [],
  imports: [NatsModule],
})
export class RestaurantsModule {}
