import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class Transactions {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'rentalCategory', required: true })
  rentalCategoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'farmerProfile', required: true })
  farmerProfileID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Location', required: true })
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

  @Prop()
  unit: string;

  @Prop()
  price: number;

  @Prop()
  paymentType: string;

  @Prop()
  isActive: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transactions);
