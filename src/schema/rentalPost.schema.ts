import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class RentalPost {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'RentalImages', required: true })
  rentalImageId: Array<Types.ObjectId>;

  @Prop({ type: MongooseSchema.Types.Mixed })
  equipments: Record<string, any>;

  @Prop()
  isActive: boolean;
}

export const RentalPostSchema = SchemaFactory.createForClass(RentalPost);
