import { Document } from 'mongoose';

export interface IOtp extends Document {
  readonly phone: number;

  readonly otp: number;
}
