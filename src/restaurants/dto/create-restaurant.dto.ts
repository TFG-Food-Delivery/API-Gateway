import {
  IsEnum,
  IsMilitaryTime,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CuisineType, CuisineTypeList } from '../enum';
import { Type } from 'class-transformer';
import { AddressDto } from 'src/common/dto/address.dto';

export class CreateRestaurantDto {
  @IsString()
  email: string;

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
