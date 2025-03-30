import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Types, Schema as MongooseSchema, Decimal128 } from 'mongoose';

@Schema({ versionKey: false })
export class Transactions {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'rentalCategory', required: true })
  rentalCategoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'farmerProfile', required: true })
  farmerProfileID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'totalamounts' })
  totalAmountId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Location' })
  locationId: Types.ObjectId;

  @Prop()
  rentalImages: Array<Types.ObjectId>;

  @Prop()
  noOfUnits: number;

  @Prop()
  totalAmount: number;

  @Prop()
  date: Date;

  @Prop()
  crop: string;

  @Prop({ type: MongooseSchema.Types.Decimal128 })
  unit: Types.Decimal128;

  @Prop()
  price: number;

  @Prop()
  farmerPhone: number;

  @Prop()
  paymentType: string;

  @Prop()
  farmerName: string;

  @Prop()
  isActive: boolean;

  @Prop()
  isVerified: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transactions);
