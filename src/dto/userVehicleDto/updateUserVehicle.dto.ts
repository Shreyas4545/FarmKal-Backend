import { PartialType } from '@nestjs/mapped-types';
import { createUserVehicleDTO } from './userVehicleDto';
export class updateUserVehicleDTO extends PartialType(createUserVehicleDTO) {}
