import { IsEmail, IsEnum, IsString } from 'class-validator';
import { VehicleType, VehicleTypeList } from '../enum/vehicle-type.enum';

export class CreateCourierDto {
  @IsEmail()
  email: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEnum(VehicleTypeList, {
    message: `Vehicle type must be one of the following: ${VehicleTypeList}`,
  })
  vehicleType: VehicleType;
}
