import { Document, Types } from 'mongoose';

export interface IDiaryInterface extends Document {
  readonly ownerId: Types.ObjectId;

  readonly driverId: Types.ObjectId;

  readonly date: Date;

  readonly isActive: boolean;

  readonly createdAt: Date;

  readonly startTime: string;
  readonly endTime: string;
  readonly type: string;
}
