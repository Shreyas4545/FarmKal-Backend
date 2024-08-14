import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReferrals } from '../../interface/referrals.interface';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectModel('Referrals')
    private referrals: Model<IReferrals>,
  ) {}

  async create(data: any): Promise<IReferrals | any> {
    const { referralId, personCount, isActive } = data;

    let newReferral: any = {
      referralId: referralId,
      personCount: personCount,
      isActive: isActive,
    };

    newReferral = await new this.referrals(newReferral).save();
    return newReferral;
  }

  async getReferrals(
    referralId: any,
  ): Promise<IReferrals | IReferrals[] | any> {
    const referrals: any = await this.referrals
      .aggregate([
        {
          $lookup: {
            from: 'users', // The users collection
            localField: 'referralId', // Field from the referrals collection
            foreignField: 'referralId', // Field from the users collection
            as: 'matchedUsers', // Output array field in the result
          },
        },
        {
          $unwind: '$matchedUsers', // Unwind the matchedUsers array to get individual documents
        },
        {
          $match: {
            'matchedUsers.referralId': referralId, // Ensure there is a match
          },
        },
        {
          $project: {
            referralId: 1, // Project the referralId from the referrals collection
            personCount: 1,
            matchedUsers: 1, // Project the matchedUsers details
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
    const { personCount, isActive } = data;

    const obj: any = {};

    if (personCount) {
      obj.personCount = personCount;
    }

    if (isActive != undefined) {
      obj.isActive = isActive;
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
