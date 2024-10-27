import { PartialType } from '@nestjs/mapped-types';
import { createTransactionDTO } from './createTransaction.dto';

export class updateTransactionDTO extends PartialType(createTransactionDTO) {}
