import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ConversationSchema } from './conversation.schema';
import { UserSchema } from './user.schema';

@Schema({ versionKey: false })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop()
  date: Date;

  @Prop()
  hours: number;

  @Prop()
  minutes: number;

  @Prop()
  seconds: number;

  @Prop()
  message: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
