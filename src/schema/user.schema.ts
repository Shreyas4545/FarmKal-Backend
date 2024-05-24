import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: number;

  @Prop()
  city: string;

  @Prop()
  isAdmin: boolean;

  @Prop()
  isVisible: boolean;

  @Prop()
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
