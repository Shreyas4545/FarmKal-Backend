import { Document, Types } from 'mongoose';

export interface IBrand extends Document {
  readonly name: string;

  readonly categoryId: Types.ObjectId;

  readonly description: string;

  readonly image: string;

  readonly isActive: boolean;
}
