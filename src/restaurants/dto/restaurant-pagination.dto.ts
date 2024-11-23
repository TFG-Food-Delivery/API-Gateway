import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { CuisineType, CuisineTypeList } from '../enum';
import { PaginationDto } from 'src/common';

export class RestaurantPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(CuisineTypeList, {
    message: `cuisineType must be one of the following values: ${CuisineTypeList}`,
  })
  cuisineType?: CuisineType;
}
