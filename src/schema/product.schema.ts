import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { CategorySchema } from './category.shema';
import { BrandSchema } from './brand.schema';
import { LocationSchema } from './location.schema';
@Schema({ versionKey: false })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brandId: string;

  @Prop({ type: Types.ObjectId, ref: 'Location', required: true })
  locationId: string;

  @Prop({ type: Types.ObjectId, ref: 'Model', required: true })
  modelId: string;

  @Prop()
  price: number;

  @Prop()
  manufacturingYear: number;

  @Prop()
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  additionalFields: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
