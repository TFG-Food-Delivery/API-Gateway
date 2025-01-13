import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

import { OrderItemDto } from './order-item.dto';
import { OrderItem } from '../types';

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  restaurantId: string;

  @IsString()
  restaurantName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItem[];
}
