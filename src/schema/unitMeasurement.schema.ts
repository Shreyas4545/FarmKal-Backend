import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class unitMeasurement {
  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop()
  isActive: boolean;
}

export const unitMeasurementSchema =
  SchemaFactory.createForClass(unitMeasurement);
