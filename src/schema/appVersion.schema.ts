import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class AppVersion {
  @Prop()
  androidVersion: string;

  @Prop()
  appStoreLink: string;

  @Prop()
  playStoreLink: string;

  @Prop()
  isDeleted: boolean;

  @Prop()
  isForceUpdate: boolean;

  @Prop()
  iosVersion: string;
}

export const AppVersionSchema = SchemaFactory.createForClass(AppVersion);
