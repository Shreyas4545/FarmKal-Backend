import { Document, Types } from 'mongoose';

export interface IDiaryInterface extends Document {
  readonly ownerId: Types.ObjectId;
  readonly customerId: Types.ObjectId;

  readonly date: Date;

  readonly status: string;

  readonly city: string;
  readonly state: string;
  readonly country: string;

  readonly createdAt: Date;

  readonly type: string;
}
