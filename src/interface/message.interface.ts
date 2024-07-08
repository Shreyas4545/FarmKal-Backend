import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  readonly conversationId: Types.ObjectId;

  readonly senderId: Types.ObjectId;

  readonly date: Date;

  readonly hours: number;

  readonly minutes: number;

  readonly seconds: number;

  readonly message: string;
}
