import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserVehicle } from '../interface/userVehicle.interface';
import { IUser } from '../interface/user.interface';

@Injectable()
export class userVehicleService {
  constructor(
    @InjectModel('UserVehicles')
    private userVehicleModel: Model<IUserVehicle>,
    @InjectModel('User') private user: Model<IUser>,
  ) {}

  async createUserVehicles(data: any): Promise<IUserVehicle | any> {
    const { price, manufacturingYear, userId, isActive, additionalFields } =
      data;

    let newUserVehicle: any = {
      userId: userId,
      price: price,
      manufacturingYear: manufacturingYear,
      isActive: isActive,
      additionalFields: additionalFields ? additionalFields : [],
    };

    newUserVehicle = await new this.userVehicleModel(newUserVehicle).save();
    return newUserVehicle;
  }

  async getUserVehicles(
    id: string,
    data: any,
  ): Promise<IUserVehicle | IUserVehicle[] | any> {
    const { additionalFields, price, manufacturingYear, isActive, userId } =
      data;

    const obj: any = {};

    if (id) {
      obj._id = id;
    }

    if (additionalFields) {
      obj.additionalFields = additionalFields;
    }

    if (price) {
      obj.price = price;
    }

    if (isActive || isActive === false) {
      obj.isActive = isActive;
    }

    if (manufacturingYear) {
      obj.manufacturingYear = manufacturingYear;
    }

    if (userId) {
      obj.userId = userId;
    }

    const userVehicles: any = await this.userVehicleModel
      .aggregate([
        {
          $addFields: {
            userId: { $toObjectId: '$userId' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            price: 1,
            manufacturingYear: 1,
            isActive: 1,
            additionalFields: 1,
            userDetails: 1,
          },
        },
      ])
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return userVehicles;
  }

  async updateUserVehicles(
    id: string,
    data: any,
  ): Promise<IUserVehicle | IUserVehicle[] | any> {
    const { additionalFields, price, manufacturingYear, isActive, userId } =
      data;

    const obj: any = {};

    if (additionalFields) {
      obj.additionalFields = additionalFields;
    }

    if (price) {
      obj.price = price;
    }

    if (isActive) {
      obj.isActive = isActive;
    }

    if (userId) {
      obj.userId = userId;
    }

    if (manufacturingYear) {
      obj.manufacturingYear = manufacturingYear;
    }

    const updatedUserVehicle = await this.userVehicleModel
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedUserVehicle;
  }
}
