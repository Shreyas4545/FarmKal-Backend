import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  city: string;

  @Prop()
  isAdmin: string;

  @Prop()
  isVisible: string;

  @Prop()
  isActive: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
