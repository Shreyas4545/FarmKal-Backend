import { Document, Types } from 'mongoose';

export interface IDriverEntry extends Document {
  readonly driverDiaryId: Types.ObjectId;

  readonly trips: number;
  readonly hours: string;

  readonly startTime: string;
  readonly endTime: string;
  readonly tripLabel: string;
  readonly createdAt: Date;

  readonly status: string;
}
