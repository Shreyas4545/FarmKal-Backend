import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: number;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  referralId: string;

  @Prop()
  isAdmin: boolean;

  @Prop()
  image: string;

  @Prop()
  isVisible: boolean;

  @Prop()
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
