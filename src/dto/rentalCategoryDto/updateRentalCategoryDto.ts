import { PartialType } from '@nestjs/mapped-types';
import { createRentalCategoryDTO } from './createRentalCategoryDto';
export class updateRentalCategoryDTO extends PartialType(
  createRentalCategoryDTO,
) {}
