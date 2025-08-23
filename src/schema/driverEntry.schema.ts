import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class DriverEntry {
  @Prop({ type: Types.ObjectId, ref: 'Driver', required: true })
  driverDiaryId: Types.ObjectId;

  @Prop()
  trips: number;

  @Prop()
  hours: number;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  tripStatus: string;

  @Prop()
  tripLabel: string;

  @Prop()
  createdAt: Date;

  @Prop()
  status: string;
}

export const DriverEntrySchema = SchemaFactory.createForClass(DriverEntry);
