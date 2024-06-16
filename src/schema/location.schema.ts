import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Location {
  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  description: string;

  @Prop()
  type: string;

  @Prop()
  image: string;

  @Prop()
  isActive: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
