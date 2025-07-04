import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DriverSchema } from './driver.schema';

@Schema({ versionKey: false, timestamps: true })
export class DriverLocation {
  @Prop({ type: Types.ObjectId, ref: 'Diary', required: true })
  diaryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driverId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: Number })
  speed: number;

  @Prop({ type: Number })
  bearing: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const DriverLocationSchema =
  SchemaFactory.createForClass(DriverLocation);
