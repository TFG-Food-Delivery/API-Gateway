import {
  IsEnum,
  IsMilitaryTime,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { AllergensList } from '../enum/allergen.enum';
import { CuisineType, CuisineTypeList } from '../enum';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  email: string;

  @IsString()
  @IsPhoneNumber('ES')
  phoneNumber: string;

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
