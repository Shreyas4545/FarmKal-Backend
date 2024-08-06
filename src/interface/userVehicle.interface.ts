import { Document, Types } from 'mongoose';

export interface IUserVehicle extends Document {
  readonly price: number;

  readonly userId: Types.ObjectId;

  readonly additionalFields: Record<string, any>;

  readonly manufacturingYear: number;

  readonly isActive: boolean;
}
