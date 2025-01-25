import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class OwnerReminder {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  farmerProfileId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop()
  reminderCount: number;

  @Prop()
  isActive: boolean;
}

export const OwnerReminderSchema = SchemaFactory.createForClass(OwnerReminder);
