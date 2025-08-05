import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class Diary {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  customerId: Types.ObjectId;

  @Prop()
  type: string;

  @Prop()
  rate: number;

  @Prop()
  date: Date;

  @Prop()
  state: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  createdAt: Date;

  @Prop()
  status: string;

  @Prop()
  customerName: string;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
