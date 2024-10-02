import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class ReferralAmount {
  @Prop()
  price: number;

  @Prop()
  status: string;
}

export const ReferralAmountSchema =
  SchemaFactory.createForClass(ReferralAmount);
