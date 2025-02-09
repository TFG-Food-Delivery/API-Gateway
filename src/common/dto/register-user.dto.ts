import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { Role, RolesList } from '../../auth/enum';
import { IsAdult } from '../../auth/validators/is-adult.validator';
import { Type } from 'class-transformer';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  image: string;

  @IsString()
  @IsPhoneNumber('ES')
  phoneNumber: string;

  @Type(() => Date)
  @IsAdult()
  dateOfBirth: Date;

  @IsString()
  @IsEnum(RolesList, {
    message: `role must be one of the following values: ${RolesList}`,
  })
  role: Role;
}
