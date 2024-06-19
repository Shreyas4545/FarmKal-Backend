import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Socialcontent {
  @Prop()
  authorId: string;

  @Prop()
  title: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop()
  publishedAt: Date;

  @Prop()
  isActive: boolean;
}

export const SocialContentSchema = SchemaFactory.createForClass(Socialcontent);
