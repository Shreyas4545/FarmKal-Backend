import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Ads {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  daysToDisplay: number;

  @Prop()
  expiryAt: Date;

  @Prop()
  isPhoto: boolean;

  @Prop()
  businessNumber: number;
}

export const adsSchema = SchemaFactory.createForClass(Ads);
