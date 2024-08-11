import { Document, Types } from 'mongoose';

export interface IReferrals extends Document {
  readonly referralId: number;

  readonly personCount: number;

  readonly isActive: boolean;
}
