import { Schema, Types } from 'mongoose';

export const FarmerExpensesSchema = new Schema(
  {
    typeOfAmount: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    modeOfPayment: {
      type: String,
      required: true,
    },
    ownerId: {
      ref: 'User',
      type: Types.ObjectId,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
