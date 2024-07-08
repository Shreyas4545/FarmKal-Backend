import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Conversation {
  @Prop()
  adminOnly: boolean;

  @Prop()
  participants: Array<string>;

  @Prop()
  createdAt: Date;

  @Prop()
  lastMessageAt: Date;

  @Prop()
  isActive: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
