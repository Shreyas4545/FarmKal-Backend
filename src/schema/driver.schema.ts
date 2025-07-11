import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class Driver {
  @Prop({ type: Types.ObjectId, ref: 'Diary', required: true })
  diaryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driverId: Types.ObjectId;

  @Prop()
  trips: number;

  @Prop()
  hours: number;

  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  rate: number;

  @Prop()
  createdAt: Date;

  @Prop()
  status: string;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
