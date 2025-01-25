import { Document, Types } from 'mongoose';

export interface IOwnerReminder extends Document {
  readonly farmerProfileId: Types.ObjectId;

  readonly ownerId: Types.ObjectId;

  readonly reminderCount: number;

  readonly isActive: boolean;
}
