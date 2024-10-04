import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReferrals } from '../../interface/referrals.interface';
import { IReferralAmount } from '../../interface/IReferralAmount.interface';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectModel('Referrals')
    private referrals: Model<IReferrals>,
    @InjectModel('ReferralAmount')
    private referralAmount: Model<IReferralAmount>,
  ) {}

  async create(data: any): Promise<IReferrals | any> {
    const { referralOwnerId, userId, status, price } = data;

    let newReferral: any = {
      referralOwnerId: referralOwnerId,
      userId: userId,
      status: status,
      price: price,
      createdAt: new Date(),
    };

    newReferral = await new this.referrals(newReferral).save();
    return newReferral;
  }

  async createReferralAmount(data: any): Promise<IReferrals | any> {
    const { status, price } = data;

    let newReferralAmount: any = {
      status: status,
      price: price,
    };

    newReferralAmount = await new this.referralAmount(newReferralAmount).save();
    return newReferralAmount;
  }

  async getReferralAmount(): Promise<IReferrals | any> {
    const ReferralAmount = await this.referralAmount.find({ status: 'ACTIVE' });
    return ReferralAmount;
  }

  async getReferrals(
    referralOwnerId: any,
  ): Promise<IReferrals | IReferrals[] | any> {
    const referrals: any = await this.referrals
      .aggregate([
        {
          $addFields: {
            referralOwnerId: { $toString: '$referralOwnerId' },
          },
        },
        {
          $lookup: {
            from: 'users', // The users collection
            localField: 'userId', // Field from the referrals collection
            foreignField: '_id', // Field from the users collection
            as: 'matchedUsers', // Output array field in the result
          },
        },
        {
          $unwind: '$matchedUsers', // Unwind the matchedUsers array to get individual documents
        },
        {
          $match: {
            referralOwnerId: referralOwnerId, // Ensure there is a match
          },
        },
        {
          $project: {
            referralOwnerId: 1, // Project the referralId from the referrals collection
            personCount: 1,
            phone: 1,
            price: 1,
            userId: 1,
          },
        },
      ])
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return referrals;
  }

  async update(
    id: string,
    data: any,
  ): Promise<IReferrals | IReferrals[] | any> {
    const { referralOwnerId, userId, status, createdAt, price } = data;

    const obj: any = {};

    if (referralOwnerId) {
      obj.referralOwnerId = referralOwnerId;
    }

    if (status) {
      obj.status = status;
    }

    if (userId) {
      obj.userId = userId;
    }

    if (createdAt) {
      obj.createAt = createdAt;
    }

    if (price) {
      obj.price = price;
    }

    const updatedReferral = await this.referrals
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedReferral;
  }
}
