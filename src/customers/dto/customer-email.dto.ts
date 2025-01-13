import { Type } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class CustomerEmailDto {
  @IsEmail()
  @Type(() => String)
  email: string;
}
