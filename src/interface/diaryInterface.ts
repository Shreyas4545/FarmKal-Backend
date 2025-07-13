import { Document, Types } from 'mongoose';

export interface IDiaryInterface extends Document {
  readonly ownerId: Types.ObjectId;
  readonly customerId: Types.ObjectId;

  readonly date: Date;

  readonly status: string;

  readonly city: string;
  readonly state: string;
  readonly rate: number;
  readonly country: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly createdAt: Date;

  readonly type: string;
}
