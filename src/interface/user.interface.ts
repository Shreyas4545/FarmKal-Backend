import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;

  readonly email: string;

  readonly phone: string;

  readonly state: string;

  readonly city: string;

  readonly country: string;

  readonly isAdmin: boolean;

  readonly referralId: boolean;

  readonly isVisible: boolean;

  readonly isActive: boolean;
}
