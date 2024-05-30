import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class OTP {
  @Prop()
  phone: number;

  @Prop()
  otp: number;
}

export const OtpSchema = SchemaFactory.createForClass(OTP);
