import { Document, Types } from 'mongoose';

export interface ITotalAmount extends Document {
  readonly amount: number;

  readonly status: string;

  readonly ownerId: Types.ObjectId;

  readonly farmerProfileID: Types.ObjectId;
}
