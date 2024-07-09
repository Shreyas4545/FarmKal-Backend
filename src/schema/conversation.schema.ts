import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class Conversation {
  @Prop()
  adminOnly: boolean;

  @Prop()
  participants: Array<Types.ObjectId>;

  @Prop()
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  lastMessage: {
    message: string;
    senderId: Types.ObjectId;
  };

  @Prop()
  lastMessageAt: Date;

  @Prop()
  isActive: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
