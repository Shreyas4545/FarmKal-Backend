import { PartialType } from '@nestjs/mapped-types';
import { createModelDTO } from './create-model.dto';

export class updateModelDTO extends PartialType(createModelDTO) {}
