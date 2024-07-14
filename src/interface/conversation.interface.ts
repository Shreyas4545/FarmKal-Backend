import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  readonly _id: Types.ObjectId;

  readonly isActive: boolean;

  readonly participants: Array<Types.ObjectId>;

  // eslint-disable-next-line @typescript-eslint/ban-types
  lastMessage: Object;

  readonly createdAt: Date;

  lastMessageAt: Date;

  readonly adminOnly: boolean;
}
