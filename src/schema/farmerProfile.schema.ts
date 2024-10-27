import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class FarmerProfile {
  @Prop()
  name: string;

  @Prop()
  phoneNo: number;

  @Prop()
  status: string;
}

export const FarmerProfileSchema = SchemaFactory.createForClass(FarmerProfile);
