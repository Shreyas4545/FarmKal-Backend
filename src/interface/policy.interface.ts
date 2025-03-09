import { Document } from 'mongoose';

export interface IPolicy extends Document {
  readonly name: string;

  readonly policy: string;
}
