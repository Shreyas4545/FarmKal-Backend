import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import { Types, Schema as MongooseSchema } from 'mongoose';

enum STATUS {
  'APPROVED',
  'INACTIVE',
  'PENDING',
  'REJECTED',
}

@Schema({ versionKey: false })
export class RentalBooking {
  @Prop({ type: Types.ObjectId, ref: 'RentalPost', required: true })
  rentalPostId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  rentalBuyerId: Array<Types.ObjectId>;

  @Prop()
  fromDate: Date;

  @Prop()
  toDate: Date;

  @Prop()
  message: string;

  @Prop()
  @IsEnum(STATUS)
  status: string;
}

export const RentalBookingSchema = SchemaFactory.createForClass(RentalBooking);
