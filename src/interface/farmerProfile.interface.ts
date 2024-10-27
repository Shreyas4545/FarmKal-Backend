import { Document, Types } from 'mongoose';

export interface IFarmerProfile extends Document {
  readonly name: string;
  readonly phoneNo: number;

  readonly status: boolean;
}
