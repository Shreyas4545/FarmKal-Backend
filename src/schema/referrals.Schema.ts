import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Referrals {
  @Prop()
  referralId: string;

  @Prop()
  personCount: number;

  @Prop()
  isActive: boolean;
}

export const ReferralsSchema = SchemaFactory.createForClass(Referrals);
