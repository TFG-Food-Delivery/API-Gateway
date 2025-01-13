import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '../../common/dto/address.dto';
import { RegisterUserDto } from '../../common/dto/register-user.dto';

export class CreateCustomerDto {
  @ValidateNested()
  @Type(() => RegisterUserDto)
  user: RegisterUserDto;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
