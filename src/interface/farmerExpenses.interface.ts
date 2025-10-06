import { Document } from 'mongoose';

export interface IFarmerExpenses extends Document {
  readonly typeOfAmount: string;
  readonly amount: string;
  readonly modeOfPayment: string;
  readonly ownerId: string;
  readonly otherDetails: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly isActive?: boolean;
}
