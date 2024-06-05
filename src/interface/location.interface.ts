import { Document } from 'mongoose';

export interface ILocation extends Document {
  readonly name: string;

  readonly description: string;

  readonly type: string;

  readonly image: string;

  readonly isActive: boolean;
}
