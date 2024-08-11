import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Referrals {
  @Prop()
  referalId: string;

  @Prop()
  personCount: string;

  @Prop()
  isActive: boolean;
}

export const ReferralsSchema = SchemaFactory.createForClass(Referrals);
