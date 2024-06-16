import { Document } from 'mongoose';

export interface ILocation extends Document {
  readonly city: string;

  readonly state: string;

  readonly country: string;

  readonly description: string;

  readonly type: string;

  readonly image: string;

  readonly isActive: boolean;
}
