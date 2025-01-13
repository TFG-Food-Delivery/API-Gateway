import {
  IsEnum,
  IsMilitaryTime,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';
import { AddressDto } from '../../common/dto/address.dto';
import { RegisterUserDto } from '../../common/dto/register-user.dto';
import { CuisineType, CuisineTypeList } from 'src/restaurants/enum';

export class CreateRestaurantDto {
  @ValidateNested()
  @Type(() => RegisterUserDto)
  user: RegisterUserDto;

  @IsString()
  restaurantName: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  image: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsEnum(CuisineTypeList, {
    message: `cuisineType must be one of the following values: ${CuisineTypeList}`,
  })
  cuisineType: CuisineType;

  @IsString()
  @IsMilitaryTime()
  openHour: string;

  @IsString()
  @IsMilitaryTime()
  closeHour: string;
}
