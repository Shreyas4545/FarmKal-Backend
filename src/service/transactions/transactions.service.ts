import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITransactions } from '../../interface/transaction.interface';
import { IFarmerProfile } from '../../interface/farmerProfile.interface';
import { IPaymentMode } from '../../interface/paymentMode.interface';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transactions')
    private transactions: Model<ITransactions>,
    @InjectModel('FarmerProfile')
    private farmerProfile: Model<IFarmerProfile>,
    @InjectModel('paymentType')
    private paymentType: Model<IPaymentMode>,
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
    } = data;

    let newTrans: any = {
      ownerId: ownerId,
      rentalCategoryId: rentalCategoryId,
      rentalImages: rentalImages,
      farmerProfileID: farmerProfileID,
      crop: crop,
      unit: unit,
      date: date,
      paymentType: paymentType,
      price: price,
      isActive: true,
    };

    newTrans = await new this.transactions(newTrans).save();
    return newTrans;
  }

  async createFarmerProfile(data: any): Promise<ITransactions | any> {
    const { name, phoneNo } = data;

    let newProfile: any = {
      name: name,
      phoneNo: phoneNo,
      status: 'ACTIVE',
    };

    newProfile = await new this.farmerProfile(newProfile).save();
    return newProfile;
  }

  async getTransactions(): Promise<ITransactions | any> {
    const transactions = await this.transactions.find({ isActive: true });
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
