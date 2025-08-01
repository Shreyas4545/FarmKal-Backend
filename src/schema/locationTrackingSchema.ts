import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class LocationTracking {
  @Prop({ type: Types.ObjectId, ref: 'Diary', required: true })
  diaryId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driverId: string;

  @Prop()
  status: string;
}

export const LocationTrackingSchema =
  SchemaFactory.createForClass(LocationTracking);
