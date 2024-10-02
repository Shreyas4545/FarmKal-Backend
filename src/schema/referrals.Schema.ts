import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { UserSchema } from './user.schema';
@Schema({ versionKey: false })
export class Referrals {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  referralOwnerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  status: string;

  @Prop()
  price: number;

  @Prop()
  createdAt: Date;
}

export const ReferralsSchema = SchemaFactory.createForClass(Referrals);
