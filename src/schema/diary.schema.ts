import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class Diary {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop()
  type: string;

  @Prop()
  date: Date;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  createdAt: Date;

  @Prop()
  status: string;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
