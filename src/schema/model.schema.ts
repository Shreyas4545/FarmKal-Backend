import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CategorySchema } from './category.shema';
import { BrandSchema } from './brand.schema';

@Schema({ versionKey: false })
export class Model {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brandId: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  isActive: boolean;
}

export const ModelSchema = SchemaFactory.createForClass(Model);
