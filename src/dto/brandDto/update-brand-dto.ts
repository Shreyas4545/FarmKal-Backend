import { PartialType } from '@nestjs/mapped-types';
import { createBrandDTO } from './create-brand.dto';

export class updateBrandDto extends PartialType(createBrandDTO) {}
