import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;

  readonly email: string;

  readonly phone: string;

  readonly city: string;

  readonly isAdmin: boolean;

  readonly isVisible: boolean;

  readonly isActive: boolean;
}
