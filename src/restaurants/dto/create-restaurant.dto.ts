import {
  IsEnum,
  IsMilitaryTime,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { CuisineType, CuisineTypeList } from '../enum';

export class CreateRestaurantDto {
  @IsString()
  email: string;

  @IsString()
  address: string;

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
