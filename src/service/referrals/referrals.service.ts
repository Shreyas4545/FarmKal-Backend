import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReferrals } from '../../interface/referrals.interface';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectModel('Referrals')
    private userVehicleModel: Model<IReferrals>,
  ) {}

  async create(data: any): Promise<IReferrals | any> {
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

  async getReferrals(
    id: string,
    referralId: any,
  ): Promise<IReferrals | IReferrals[] | any> {
    const obj: any = {};

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

  async update(
    id: string,
    data: any,
  ): Promise<IReferrals | IReferrals[] | any> {
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
