import { Document } from 'mongoose';

export interface IRentalCategory extends Document {
  readonly name: string;
  readonly isActive: boolean;
  readonly isTrip: boolean;
}
