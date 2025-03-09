import { Document } from 'mongoose';

export interface IPolicy extends Document {
  readonly policy: string;
}
