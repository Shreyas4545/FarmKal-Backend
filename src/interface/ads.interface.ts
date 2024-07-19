import { Document } from 'mongoose';

export interface IAds extends Document {
  readonly name: string;

  readonly description: string;

  readonly image: string;

  readonly isActive: boolean;

  readonly createdAt: Date;

  readonly daysToDisplay: number;
}
