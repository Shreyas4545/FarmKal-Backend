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
  readonly paymentType: string;
  readonly price: number;

  readonly isActive: boolean;
}
