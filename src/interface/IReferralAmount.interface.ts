import { Document, Types } from 'mongoose';

export interface IReferralAmount extends Document {
  readonly status: string;

  readonly price: number;
}
