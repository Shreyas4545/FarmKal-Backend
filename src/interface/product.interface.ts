import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  readonly price: number;

  readonly modelId: Types.ObjectId;

  readonly categoryId: Types.ObjectId;

  readonly brandId: Types.ObjectId;

  readonly locationId: Types.ObjectId;

  readonly userId: Types.ObjectId;

  readonly additionalFields: Record<string, any>;

  readonly manufacturingYear: number;

  readonly isActive: boolean;
}
