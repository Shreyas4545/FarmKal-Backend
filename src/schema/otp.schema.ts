import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OTP {
  @Prop()
  phone: number;

  @Prop()
  otp: number;
}

export const OtpSchema = SchemaFactory.createForClass(OTP);
