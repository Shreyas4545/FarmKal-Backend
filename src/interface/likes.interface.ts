import { Document, Types } from 'mongoose';

export interface ILikes extends Document {
  readonly userId: Types.ObjectId;

  readonly postId: Types.ObjectId;

  readonly createdAt: Date;
}
