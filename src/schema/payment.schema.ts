import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class Payment {
  @Prop()
  amount: number;

  @Prop()
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'totalAmount', required: true })
  totalAmountId: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
