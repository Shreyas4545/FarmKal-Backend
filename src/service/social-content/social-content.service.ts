import { Injectable } from '@nestjs/common';
import { createSocialContentDto } from '../../dto/socialContentDto/create-socialContent.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ISocialContent } from '../../interface/socialContent.interface';

@Injectable()
export class SocialContentService {
  constructor(
    @InjectModel('Socialcontent') private socialContent: Model<ISocialContent>,
  ) {}

  async addContent(data: createSocialContentDto): Promise<ISocialContent> {
    const socialContent: any = new this.socialContent(data);
    return await socialContent.save();
  }

  async getContent(id: string, data: any): Promise<ISocialContent[]> {
    const obj: any = {};
    if (id) {
      obj._id = id;
    }

    const socialContent: any = await this.socialContent
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return socialContent;
  }

  async updateSocialContent(id: string, data: any): Promise<ISocialContent> {
    const obj: any = {};
    const { title, isActive, description, authorId, image } = data;

    if (title) {
      obj.title = title;
    }

    if (description) {
      obj.description = description;
    }

    if (authorId) {
      obj.authorId = authorId;
    }

    if (image) {
      obj.image = image;
    }

    if (isActive) {
      obj.isActive = isActive;
    }

    const updatedSocialContent: any = await this.socialContent
      .findOneAndUpdate({ _id: id }, obj, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return updatedSocialContent;
  }
}
