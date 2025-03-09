import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class PrivacyPolicy {
  @Prop()
  name: string;

  @Prop()
  policy: string;
}

export const PrivacyPolicySchema = SchemaFactory.createForClass(PrivacyPolicy);
