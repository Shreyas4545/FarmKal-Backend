import { Document, Types } from 'mongoose';

export interface IAppVersion extends Document {
  readonly androidVersion: string;

  readonly appStoreLink: string;

  readonly playStoreLink: string;

  readonly isDeleted: boolean;

  readonly isForceUpdate: boolean;

  readonly iosVersion: string;
}
