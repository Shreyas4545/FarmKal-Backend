import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class RentalImages {
  @Prop()
  image: string;

  @Prop()
  isActive: boolean;
}

export const rentalImagesSchema = SchemaFactory.createForClass(RentalImages);
