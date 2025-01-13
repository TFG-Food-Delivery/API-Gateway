import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsPostalCode,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from 'src/common/dto';

export class CreateCustomerDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  lastName: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsPostalCode('ES')
  zipCode: string;

  @IsOptional()
  @IsString()
  addressInfo: string;
}
