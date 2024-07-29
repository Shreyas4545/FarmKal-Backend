import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILikes } from '../../../interface/likes.interface';
import { LikesDto } from '../../../dto/likesDto/likes.dto';

@Injectable()
export class LikesService {
  constructor(@InjectModel('Likes') private likeModel: Model<ILikes>) {}

  async addLike(data: LikesDto): Promise<ILikes> {
    const like: any = new this.likeModel(data);
    return await like.save();
  }

  async getTotalLikesOfPost(postId: string): Promise<number | any> {
    const obj: any = {};
    if (postId) {
      obj.postId = postId;
    }

    const likesCount: number | any = await this.likeModel
      .find(obj)
      .count()
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return likesCount;
  }

  async getLikes(postId: string, userId: string): Promise<ILikes | any> {
    const obj: any = {};
    if (postId) {
      obj.postId = postId;
    }

    if (userId) {
      obj.userId = userId;
    }

    const likes: ILikes[] | any = await this.likeModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return likes;
  }

  async getAllUserLikedPosts(userId: string): Promise<number | any> {
    const obj: any = {};
    if (userId) {
      obj.userId = userId;
    }

    const likes: number | any = await this.likeModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return likes;
  }

  async updateLike(id: string): Promise<ILikes> {
    const updatedLike: ILikes | any = await this.likeModel
      .findByIdAndDelete(id)
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return updatedLike;
  }
}
