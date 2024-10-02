import { Document, Types } from 'mongoose';

export interface IReferrals extends Document {
  readonly referralOwnerId: Types.ObjectId;

  readonly userId: Types.ObjectId;

  readonly status: string;

  readonly price: number;

  readonly createdAt: Date;
}
