import { Document, Types } from 'mongoose';

export interface IModel extends Document {
  readonly name: string;

  readonly categoryId: Types.ObjectId;

  readonly brandId: Types.ObjectId;

  readonly description: string;

  readonly image: string;

  readonly isActive: boolean;
}
