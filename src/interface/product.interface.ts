import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  readonly price: string;

  readonly modelId: Types.ObjectId;

  readonly categoryId: Types.ObjectId;

  readonly brandId: Types.ObjectId;

  readonly locationId: Types.ObjectId;

  readonly additionalFields: Record<string, any>;

  readonly manufacturingYear: string;

  readonly isActive: boolean;
}
