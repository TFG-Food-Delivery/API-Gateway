import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AddressDto } from 'src/common/dto';
import { UserDto } from 'src/common/dto/user.dto';

export class UpdateCustomerDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
