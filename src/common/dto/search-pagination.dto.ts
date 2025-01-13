import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common';

export class SearchPaginationDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
