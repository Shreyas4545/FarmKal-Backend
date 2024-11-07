import { Document, Types } from 'mongoose';

export interface ITransactions extends Document {
  readonly ownerId: Types.ObjectId;

  readonly rentalImages: Array<Types.ObjectId>;
  readonly rentalCategoryId: Types.ObjectId;
  readonly farmerProfileID: Types.ObjectId;
  readonly locationId: Types.ObjectId;
  readonly date: Date;
  readonly crop: string;
  readonly unit: string;
  readonly city: string;
  readonly state: string;
  readonly country: string;
  readonly noOfUnits: number;
  readonly totalAmount: number;
  readonly paymentType: string;
  readonly price: number;
  readonly isActive: boolean;
}
