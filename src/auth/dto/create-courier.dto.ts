import { IsEnum, IsString, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { RegisterUserDto } from '../../common/dto/register-user.dto';
import {
  VehicleType,
  VehicleTypeList,
} from 'src/couriers/enum/vehicle-type.enum';

export class CreateCourierDto {
  @ValidateNested()
  @Type(() => RegisterUserDto)
  user: RegisterUserDto;

  @IsString()
  @IsEnum(VehicleType, {
    message: `Vehicle type must be one of the following: ${VehicleTypeList}`,
  })
  vehicleType: VehicleType;
}
