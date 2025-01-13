import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Allergen, AllergensList } from '../enum';
import { Type } from 'class-transformer';

export class CreateDishDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsUrl()
  image?: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsArray()
  @IsEnum(AllergensList, {
    message: `allergens must be one of the following values: ${AllergensList}`,
    each: true,
  })
  allergens: Allergen[] = [];
}
