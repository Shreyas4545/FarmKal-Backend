import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class Diary {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'FarmerProfile', required: true })
  driverId: Types.ObjectId;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  tripCount: number;

  @Prop()
  type: string;

  @Prop()
  date: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  isActive: boolean;
}

export const DiarySchema = SchemaFactory.createForClass(Diary);
