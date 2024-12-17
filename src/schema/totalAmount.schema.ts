import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class totalAmount {
  @Prop()
  amount: number;

  @Prop()
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'farmerProfile', required: true })
  farmerProfileID: Types.ObjectId;
}

export const TotalAmountSchema = SchemaFactory.createForClass(totalAmount);
