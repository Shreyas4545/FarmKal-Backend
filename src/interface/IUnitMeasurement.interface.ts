import { Document } from 'mongoose';

export interface IUnit extends Document {
  readonly title: string;
  readonly category: string;
  readonly isActive: boolean;
}
