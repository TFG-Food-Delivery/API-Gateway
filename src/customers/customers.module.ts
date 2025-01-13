import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { NatsModule } from 'src/common/transports/nats.module';
import { CustomerCompositionService } from './queries';

@Module({
  controllers: [CustomersController],
  providers: [CustomerCompositionService],
  imports: [NatsModule],
})
export class CustomersModule {}
