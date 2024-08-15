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

  async getContent(
    id: string,
    userId: string,
    data: any,
  ): Promise<ISocialContent[]> {
    const obj: any = {};
    if (id) {
      obj._id = id;
    }

    obj.isActive = true;

    const socialContent: any = await this.socialContent
      .aggregate([
        {
          $lookup: {
            from: 'likes',
            let: { postId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$postId', '$$postId'] }, // Match the postId in likes
                      { $eq: ['$userId', userId] }, // Match the userId in likes
                    ],
                  },
                },
              },
              {
                $project: { _id: 1 }, // Only project the _id field, we only need to know if it exists
              },
            ],
            as: 'likes',
          },
        },
        {
          $addFields: {
            postID: { $toString: '$_id' },
          },
        },
        {
          $lookup: {
            from: 'likes',
            localField: 'postID',
            foreignField: 'postId',
            as: 'postLikes',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            image: 1,
            description: 1,
            isActive: 1,
            createdAt: 1,
            updatedAt: 1,
            totalLikes: { $size: '$postLikes' },
            isLiked: { $gt: [{ $size: '$likes' }, 0] }, // Boolean field for order presence
          },
        },
      ])
      .sort({ createdAt: 1 })
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
