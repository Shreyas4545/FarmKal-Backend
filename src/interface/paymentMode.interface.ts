import { Document } from 'mongoose';

export interface IPaymentMode extends Document {
  readonly method: string;

  readonly isActive: boolean;
}
