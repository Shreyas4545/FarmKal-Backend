import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  readonly _id: Types.ObjectId;

  readonly isActive: boolean;

  readonly participants: Array<string>;

  readonly createdAt: Date;

  readonly lastMessageAt: Date;

  readonly adminOnly: boolean;
}
