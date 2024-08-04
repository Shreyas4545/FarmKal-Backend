import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ versionKey: false })
export class UserVehicles {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  price: number;

  @Prop()
  manufacturingYear: number;

  @Prop()
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  additionalFields: Record<string, any>;
}

export const UserVehiclesSchema = SchemaFactory.createForClass(UserVehicles);
