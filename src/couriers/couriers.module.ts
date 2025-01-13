import { Module } from '@nestjs/common';
import { CouriersController } from './couriers.controller';
import { NatsModule } from 'src/common/transports/nats.module';

@Module({
  controllers: [CouriersController],
  providers: [],
  imports: [NatsModule],
})
export class CouriersModule {}
