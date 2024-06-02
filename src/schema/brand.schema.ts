import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CategorySchema } from './category.shema';

@Schema({ versionKey: false })
export class Brand {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  isActive: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
