import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class paymentType {
  @Prop()
  method: string;

  @Prop()
  isActive: boolean;
}

export const paymentTypeSchema = SchemaFactory.createForClass(paymentType);
