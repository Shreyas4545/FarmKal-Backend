import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class rentalCategory {
  @Prop()
  name: string;

  @Prop()
  isActive: boolean;

  @Prop()
  isTrip: boolean;
}

export const rentalCategorySchema =
  SchemaFactory.createForClass(rentalCategory);
