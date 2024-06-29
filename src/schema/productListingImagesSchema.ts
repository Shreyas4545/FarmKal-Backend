import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ProductSchema } from './product.schema';

@Schema({ versionKey: false })
export class ProductImages {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop()
  imageUrl: string;
}

export const ProductImagesSchema = SchemaFactory.createForClass(ProductImages);
