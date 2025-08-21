import { Document, Types } from 'mongoose';

export interface IDriver extends Document {
  readonly diaryId: Types.ObjectId;
  readonly driverId: Types.ObjectId;

  readonly createdAt: Date;

  readonly status: string;
  readonly driverName: string;
}
