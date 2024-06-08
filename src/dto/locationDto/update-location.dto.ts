import { PartialType } from '@nestjs/mapped-types';
import { LocationDTO } from './createLocation.dto';

export class updateLocationDTO extends PartialType(LocationDTO) {}
