import { Document, Types } from 'mongoose';

export interface IDriver extends Document {
  readonly diaryId: Types.ObjectId;
  readonly driverId: Types.ObjectId;

  readonly trips: number;
  readonly hours: number;

  readonly startTime: string;
  readonly endTime: string;
  readonly createdAt: Date;

  readonly status: string;
}
