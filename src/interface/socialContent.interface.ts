import { Document, Types } from 'mongoose';

export interface ISocialContent extends Document {
  readonly authorId: Types.ObjectId;

  readonly title: string;

  readonly image: string;

  readonly description: string;

  readonly publishedAt: Date;

  readonly isActive: boolean;
}
