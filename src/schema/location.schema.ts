import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Location {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  type: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
