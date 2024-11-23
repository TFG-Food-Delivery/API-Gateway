import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomIngredientDto } from './custom-ingredient.dto';
import { Allergen, AllergensList } from '../enum';

export class CreateDishDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsArray()
  @IsEnum(AllergensList, {
    message: `allergens must be one of the following values: ${AllergensList}`,
    each: true,
  })
  allergens: Allergen[];

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada elemento del array
  @Type(() => CustomIngredientDto) // Transforma los elementos en instancias de customIngredient
  @IsOptional()
  customIngredients?: CustomIngredientDto[] = [];
}
