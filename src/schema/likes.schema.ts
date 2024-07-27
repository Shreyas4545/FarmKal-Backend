import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class Likes {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'SocialContent', required: true })
  postId: string;

  @Prop()
  createdAt: Date;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);
