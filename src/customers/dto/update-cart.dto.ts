import { IsEmail, IsUUID } from 'class-validator';

export class UpdateCartDto {
  @IsUUID(4)
  dishId: string;
}
