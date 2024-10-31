import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransactions } from '../../interface/transaction.interface';
import { IFarmerProfile } from '../../interface/farmerProfile.interface';
import { IPaymentMode } from '../../interface/paymentMode.interface';
import { IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { ILocation } from 'src/interface/location.interface';
class getAllTransactions {
  readonly ownerId: string;
  readonly farmerProfileId: string;
  @IsOptional()
  readonly paymentType: string;
  @IsOptional()
  readonly rentalCategoryId: string;
}
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transactions')
    private transactions: Model<ITransactions>,
    @InjectModel('FarmerProfile')
    private farmerProfile: Model<IFarmerProfile>,
    @InjectModel('paymentType')
    private paymentType: Model<IPaymentMode>,
    @InjectModel('Location') private locationModel: Model<ILocation>,
  ) {}

  async create(data: any): Promise<ITransactions | any> {
    const {
      ownerId,
      rentalCategoryId,
      rentalImages,
      farmerProfileID,
      crop,
      unit,
      date,
      paymentType,
      price,
      city,
      state,
      country,
    } = data;

    let { locationId } = data;
    if (!locationId) {
      const existingLocation: any = await this.locationModel
        .findOne({
          city: city,
          state: state,
          country: country,
        })
        .catch((err) => {
          console.log(err);
        });

      if (existingLocation) {
        locationId = existingLocation?._id.toString();
      } else {
        const newLocation = {
          city: city,
          state: state,
          country: country,
          isActive: true,
          description: 'City in Rajasthan',
          type: 'City',
          image:
            'https://storage.googleapis.com/farm7-e6457.appspot.com/images/e2f2decf-986f-44b3-9377-dc7e3fbde743-.png',
        };

        const addedLocation = await new this.locationModel(newLocation).save();
        locationId = addedLocation?._id.toString();
      }
    }

    let newTrans: any = {
      ownerId: ownerId,
      rentalCategoryId: rentalCategoryId,
      rentalImages: rentalImages,
      farmerProfileID: farmerProfileID,
      crop: crop,
      locationId: locationId,
      unit: unit,
      date: date,
      paymentType: paymentType,
      price: price,
      isActive: true,
    };

    newTrans = await new this.transactions(newTrans).save();
    return newTrans;
  }

  async createFarmerProfile(data: any): Promise<IFarmerProfile | any> {
    const { name, phoneNo } = data;

    console.log(phoneNo);
    const existingData: any = await this.farmerProfile
      .find({ phoneNo: phoneNo })
      .catch((err) => {
        console.log(err);
      });

    if (existingData?.length > 0) {
      return existingData[0];
    }

    let newProfile: any = {
      name: name,
      phoneNo: phoneNo,
      status: 'ACTIVE',
    };

    newProfile = await new this.farmerProfile(newProfile).save();
    return newProfile;
  }

  async getFarmerProfile(data: any): Promise<IFarmerProfile | any> {
    const { phoneNo } = data;

    let newProfile: any = {
      phoneNo: phoneNo,
    };

    newProfile = await this.farmerProfile.find(newProfile);
    return newProfile;
  }

  async getOwnerTransactions(ownerId: string): Promise<ITransactions | any> {
    const transactions = await this.transactions.aggregate([
      {
        $addFields: {
          rentalCategoryId: { $toObjectId: '$rentalCategoryId' },
          locationId: { $toObjectId: '$locationId' },
        },
      },
      {
        $lookup: {
          from: 'farmerprofiles',
          localField: 'farmerProfileID',
          foreignField: '_id',
          as: 'farmerProfile',
        },
      },
      {
        $lookup: {
          from: 'rentalcategories',
          localField: 'rentalCategoryId',
          foreignField: '_id',
          as: 'rentalCategory',
        },
      },
      {
        $lookup: {
          from: 'locations',
          localField: 'locationId',
          foreignField: '_id',
          as: 'locationDetails',
        },
      },
      {
        $unwind: '$rentalCategory',
      },
      {
        $unwind: '$farmerProfile',
      },
      {
        $unwind: '$locationDetails',
      },
      {
        $match: { ownerId: ownerId },
      },
      {
        $project: {
          farmerName: '$farmerProfile.name',
          farmerPhoneNo: '$farmerProfile.phoneNo',
          farmerProfileID: 1,
          locationDetails: 1,
          rentalImages: 1,
          date: 1,
          crop: 1,
          unit: 1,
          price: 1,
          paymentType: 1,
          isActive: 1,
        },
      },
    ]);

    const newData: any = [];
    transactions?.map((item, key) => {
      if (!newData?.find((s) => s.farmerName == item.farmerName)) {
        newData.push({
          farmerName: item?.farmerName,
          phoneNo: item?.farmerPhoneNo,
          id: item?.farmerProfileID,
        });
      }
    });
    return newData;
  }

  async getAllTransactions(
    data: getAllTransactions,
  ): Promise<ITransactions | any> {
    const { farmerProfileId, ownerId, paymentType, rentalCategoryId } = data;
    const obj: any = {};

    if (farmerProfileId) {
      obj.farmerProfileID = new mongoose.Types.ObjectId(farmerProfileId);
    }

    if (ownerId) {
      obj.ownerId = ownerId;
    }

    if (paymentType) {
      obj.paymentType = paymentType;
    }

    if (rentalCategoryId) {
      obj.rentalCategoryId = rentalCategoryId;
    }

    console.log(obj);

    const transactions = await this.transactions
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
        return err;
      });
    return transactions;
  }

  async update(
    id: string,
    data: any,
  ): Promise<ITransactions | ITransactions[] | any> {
    const {
      ownerId,
      rentalCategoryId,
      rentalImages,
      farmerProfileID,
      crop,
      unit,
      paymentType,
      price,
    } = data;

    const obj: any = {};

    if (ownerId) {
      obj.ownerId = ownerId;
    }

    if (rentalCategoryId) {
      obj.rentalCategoryId = rentalCategoryId;
    }

    if (rentalImages) {
      obj.rentalImages = rentalImages;
    }

    if (farmerProfileID) {
      obj.farmerProfileID = farmerProfileID;
    }

    if (crop) {
      obj.crop = crop;
    }

    if (unit) {
      obj.unit = unit;
    }

    if (paymentType) {
      obj.paymentType = paymentType;
    }

    if (price) {
      obj.price = price;
    }

    const updatedTransaction = await this.transactions
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedTransaction;
  }

  async addPaymentMode(data: any): Promise<IPaymentMode | any> {
    const newPaymentMode = await new this.paymentType(data).save();
    return newPaymentMode;
  }

  async getPaymentTypes(id: string): Promise<IPaymentMode | any> {
    const obj: any = {
      isActive: true,
    };
    if (id) {
      obj._id = id;
    }
    const data = await this.paymentType.find(obj);
    return data;
  }
}