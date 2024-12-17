import { Document, Types } from 'mongoose';

export interface IPayment extends Document {
  readonly amount: number;

  readonly status: string;

  readonly totalAmountId: Types.ObjectId;
}
