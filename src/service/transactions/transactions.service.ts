import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo } from 'mongoose';
import { ITransactions } from '../../interface/transaction.interface';
import { IFarmerProfile } from '../../interface/farmerProfile.interface';
import { IPaymentMode } from '../../interface/paymentMode.interface';
import { ILocation } from '../../../src/interface/location.interface';
import { ITotalAmount } from '../../interface/totalAmount.interface';
import { IPayment } from '../../interface/payment.interface';
import { IDiaryInterface } from '../../interface/diaryInterface';
import { IOwnerReminder } from '../../interface/ownerReminder.interface';
import { IUser } from '../../interface/user.interface';
import { IDriver } from '../../interface/driverInterface';
import { IDriverLocation } from 'src/interface/driverLocation.interface';
class getAllTransactions {
  readonly ownerId: string;
  readonly farmerProfileId: string;
}
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transactions')
    private transactions: Model<ITransactions>,
    @InjectModel('User')
    private user: Model<IUser>,
    @InjectModel('Diary')
    private diary: Model<IDiaryInterface>,
    @InjectModel('Driver')
    private driver: Model<IDriver>,
    @InjectModel('DriverLocation')
    private driverLocation: Model<IDriverLocation>,
    @InjectModel('totalAmount')
    private totalAmount: Model<ITotalAmount>,
    @InjectModel('FarmerProfile')
    private farmerProfile: Model<IFarmerProfile>,
    @InjectModel('paymentType')
    private paymentType: Model<IPaymentMode>,
    @InjectModel('Payment')
    private Payment: Model<IPayment>,
    @InjectModel('Location') private locationModel: Model<ILocation>,
    @InjectModel('OwnerReminder')
    private OwnerReminderModel: Model<IOwnerReminder>,
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
      farmerPhone,
      farmerName,
      state,
      country,
      totalAmount,
      noOfUnits,
      isVerified,
    } = data;

    console.log(data);
    let { locationId } = data;
    if (!locationId && city && state && country) {
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
      unit: unit ? unit : 0.0,
      isVerified: isVerified,
      farmerName: farmerName,
      farmerPhone: farmerPhone,
      date: date,
      paymentType: paymentType,
      price: price,
      totalAmount: totalAmount,
      noOfUnits: noOfUnits,
      isActive: true,
    };

    newTrans = await new this.transactions(newTrans).save();

    return newTrans;
  }

  async createFarmerProfile(data: any): Promise<IFarmerProfile | any> {
    const { name, phoneNo, isValidated } = data;

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
      isValidated: isValidated,
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
        $unwind: {
          path: '$locationDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: { ownerId: ownerId },
      },
      {
        $project: {
          // farmerName: '$farmerProfile.name',
          // farmerPhoneNo: '$farmerProfile.phoneNo',
          farmerPhone: 1,
          farmerName: 1,
          farmerProfileID: 1,
          locationDetails: 1,
          rentalImages: 1,
          rentalCategoryName: '$rentalCategory.name',
          city: '$locationDetails.city',
          state: '$locationDetails.state',
          country: '$locationDetails.country',
          date: 1,
          crop: 1,
          noOfUnits: 1,
          totalAmount: 1,
          unit: 1,
          price: 1,
          paymentType: 1,
          isActive: 1,
        },
      },
    ]);

    for (let i of transactions) {
      const multiData = transactions?.filter(
        (s) => s.farmerPhone == i?.farmerPhone,
      );
      i.farmerName = multiData[0].farmerName;
    }

    const newData: any = [];
    transactions?.map((item, key) => {
      if (!newData?.find((s) => s.id == item?.farmerProfileID.toString())) {
        newData.push({
          farmerName: item?.farmerName,
          farmerPhone: item?.farmerPhone,
          rentalCategoryName: item?.rentalCategoryName,
          city: item?.city,
          state: item?.state,
          country: item?.country,
          id: item?.farmerProfileID,
        });
      }
    });
    return newData;
  }

  async getAllTransactions(
    data: getAllTransactions,
  ): Promise<ITransactions | any> {
    const { ownerId, farmerProfileId } = data;
    let transactions: any = await this.transactions.aggregate([
      {
        $addFields: {
          rentalCategoryId: { $toObjectId: '$rentalCategoryId' },
          locationId: { $toObjectId: '$locationId' },
          farmerProfileId: { $toString: '$farmerProfileID' },
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
          from: 'totalamounts',
          localField: 'totalAmountId',
          foreignField: '_id',
          as: 'totalAmountDetails',
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
        $unwind: '$totalAmountDetails',
      },
      {
        $unwind: '$farmerProfile',
      },
      {
        $unwind: {
          path: '$locationDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ownerId: ownerId,
          farmerProfileId: farmerProfileId,
        },
      },
      {
        $project: {
          farmerName: 1,
          farmerPhone: 1,
          farmerProfileID: 1,
          rentalImages: 1,
          // locationDetails: 1,
          totalAmountId: '$totalAmountDetails._id',
          totalAmountStatus: '$totalAmountDetails.status',
          rentalCategoryName: '$rentalCategory.name',
          isTrip: '$rentalCategory.isTrip',
          locationId: '$locationDetails._id',
          city: '$locationDetails.city',
          state: '$locationDetails.state',
          country: '$locationDetails.country',
          date: 1,
          crop: 1,
          noOfUnits: 1,
          totalAmount: 1,
          unit: 1,
          price: 1,
          paymentType: 1,
          isActive: 1,
        },
      },
    ]);

    for (let i of transactions) {
      if (i?.unit) i.unit = i?.unit.toString();
      if (i?.unit == '') i.unit = '0';
    }
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
      totalAmountId,
      unit,
      paymentType,
      price,
    } = data;

    const obj: any = {};

    if (ownerId) {
      obj.ownerId = ownerId;
    }

    if (totalAmountId) {
      obj.totalAmountId = totalAmountId;
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

  async addTotalAmount(data: any): Promise<ITotalAmount | any> {
    const {
      ownerId,
      farmerProfileID,
      amount,
    }: { ownerId: string; farmerProfileID: string; amount: number } = data;

    const obj: any = {};
    obj.ownerId = ownerId;
    obj.farmerProfileID = farmerProfileID;
    obj.amount = amount;
    obj.status = 'ACTIVE';

    const newTotalAmount = await new this.totalAmount(obj).save();

    return newTotalAmount;
  }

  async getTotalAmount(data: any): Promise<ITotalAmount | any> {
    const {
      totalAmountId,
      ownerId,
      farmerProfileID,
    }: { totalAmountId: string; ownerId: string; farmerProfileID: string } =
      data;

    const obj: any = {};
    if (totalAmountId) obj._id = totalAmountId;
    if (ownerId) obj.ownerId = ownerId;
    if (farmerProfileID) obj.farmerProfileID = farmerProfileID;
    obj.status = 'ACTIVE';

    const TotalAmountData = await this.totalAmount
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return TotalAmountData;
  }

  async updateTotalAmount(id: string, data: any): Promise<ITotalAmount | any> {
    const { amount, status }: { amount: number; status: string } = data;
    const obj: any = {};
    if (amount) {
      obj.amount = amount;
    }
    if (status) {
      obj.status = status;
    }

    const updatedData = await this.totalAmount
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedData;
  }

  async addPayment(data: any): Promise<IPayment | any> {
    const { amount, totalAmountId }: { amount: number; totalAmountId: number } =
      data;

    const obj: any = {};
    obj.amount = amount;
    obj.totalAmountId = totalAmountId;
    obj.date = new Date();
    obj.status = 'ACTIVE';

    const newPayment = await new this.Payment(obj).save();
    return newPayment;
  }

  async getPaymentHistory(data: any): Promise<IPayment | any> {
    const {
      ownerId,
      farmerProfileID,
    }: { ownerId: string; farmerProfileID: string } = data;

    const paymentData = await this.Payment.aggregate([
      {
        $addFields: { totalAmountId: { $toObjectId: '$totalAmountId' } },
      },
      {
        $lookup: {
          from: 'totalamounts',
          localField: 'totalAmountId',
          foreignField: '_id',
          as: 'totalAmountDetails',
        },
      },
      {
        $unwind: '$totalAmountDetails', // Flatten totalAmountDetails to access its fields
      },
      {
        $match: {
          'totalAmountDetails.ownerId': ownerId,
          'totalAmountDetails.farmerProfileID': new mongoose.Types.ObjectId(
            farmerProfileID,
          ), // Match ObjectId
        },
      },
      {
        $project: {
          amount: 1,
          status: 1,
          date: 1,
          totalAmountId: 1,
        },
      },
    ]).exec();

    return paymentData;
  }

  async getPayment(totalAmountId: string): Promise<IPayment | any> {
    const payments: any[] | any = await this.Payment.find({
      totalAmountId: totalAmountId,
    })
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return payments;
  }

  async getDashboardData(ownerId: string): Promise<any> {
    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

    const data: any[] | any = await this.transactions.find({
      $and: [
        {
          date: {
            $gte: startOfDay,
          },
        },
        {
          date: {
            $lt: endOfDay,
          },
        },
        {
          ownerId: ownerId,
        },
        {
          status: 'ACTIVE',
        },
      ],
    });

    const obj = {
      ownerId: ownerId,
    };

    const data1: any[] | any = await this.transactions
      .find(obj)
      .catch((err) => {
        console.log(err);
      });

    const returnObj = {
      currDayEarnings: data?.reduce(
        (acc: any, it: any) => acc + it.totalAmount,
        0,
      ),
      totalEarnings: data1?.reduce(
        (acc: any, it: any) => acc + it.totalAmount,
        0,
      ),
    };
    return returnObj;
  }

  async getTripCount(ownerId: string, phoneNo: number): Promise<any> {
    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999));

    let data: any[] | any = await this.transactions.aggregate([
      {
        $addFields: {
          rentalCategoryId: { $toObjectId: '$rentalCategoryId' },
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
          from: 'farmerprofiles',
          localField: 'farmerProfileID',
          foreignField: '_id',
          as: 'farmerProfile',
        },
      },
      {
        $unwind: '$farmerProfile',
      },
      {
        $unwind: '$rentalCategory',
      },
      {
        $match: {
          ownerId: ownerId,
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          isActive: true,
        },
      },
      {
        $project: {
          noOfUnits: 1,
          farmerPhoneNo: '$farmerProfile.phoneNo',
          rentalCategoryName: '$rentalCategory.name',
        },
      },
    ]);

    const obj: any = {};
    if (phoneNo) {
      data = data?.filter((s, key) => s.farmerPhoneNo == phoneNo);
    }
    data?.map((it, key) => {
      if (!obj[it.rentalCategoryName]) {
        obj[it.rentalCategoryName] = it.noOfUnits;
      } else {
        obj[it.rentalCategoryName] += it.noOfUnits;
      }
    });

    return obj;
  }

  async addOwnerReminder(data: any): Promise<any> {
    const { ownerId, farmerProfileId } = data;

    let Obj: any = {
      ownerId,
      farmerProfileId,
      isActive: 1,
    };

    const existingData: any = await this.OwnerReminderModel.find(Obj).catch(
      (err) => {
        console.log(err);
      },
    );

    let reminderData;
    if (existingData?.length > 0) {
      reminderData = await this.OwnerReminderModel.findOneAndUpdate(
        { _id: existingData[0]?._id },
        { $set: { reminderCount: existingData[0]?.reminderCount + 1 } },
      ).catch((err) => {
        console.log(err);
      });
    } else {
      Obj.reminderCount = 1;
      reminderData = await this.OwnerReminderModel.create(Obj).catch((err) => {
        console.log(err);
      });
    }

    return reminderData;
  }

  async addDiary(data: any): Promise<any> {
    return await this.diary.create(data);
  }

  async getDiaries(customerId?: string): Promise<any[]> {
    const matchStage = customerId ? { customerId: customerId } : {};

    return await this.diary
      .aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'users', // MongoDB collection name
            localField: 'ownerId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        { $unwind: '$owner' }, // optional: flatten the array if you expect one user
        {
          $project: {
            _id: 1,
            customerId: 1,
            ownerId: 1,
            ownerName: '$owner.name', // get the owner's name
            type: 1,
            date: 1,
            state: 1,
            city: 1,
            country: 1,
            createdAt: 1,
            status: 1,
          },
        },
      ])
      .exec();
  }

  async updateDiaryStatus(id: string, data: any): Promise<any> {
    const updateObj: any = {};
    const { type, city, state, country, latitude, longitude, status } = data;
    if (status) {
      updateObj.status = status;
    }
    if (city) {
      updateObj.city = city;
    }
    if (state) {
      updateObj.state = state;
    }
    if (country) {
      updateObj.country = country;
    }
    if (latitude) {
      updateObj.latitude = latitude;
    }
    if (longitude) {
      updateObj.longitude = longitude;
    }
    if (type) {
      updateObj.type = type;
    }

    return await this.diary
      .findByIdAndUpdate(id, updateObj, { new: true })
      .exec();
  }

  async createDriver(data: Partial<any>): Promise<any> {
    return await this.driver.create(data);
  }

  async getDriverEntryDetails(diaryId: string): Promise<any> {
    return await this.diary
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(diaryId),
          },
        },
        {
          $lookup: {
            from: 'drivers',
            let: { diaryIdStr: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$diaryId', '$$diaryIdStr'] },
                },
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'driverId',
                  foreignField: '_id',
                  as: 'driverInfo',
                },
              },
              {
                $unwind: {
                  path: '$driverInfo',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  _id: 1,
                  driverId: 1,
                  name: '$driverInfo.name',
                  trips: 1,
                  hours: 1,
                  startTime: 1,
                  endTime: 1,
                  status: 1,
                  createdAt: 1,
                },
              },
            ],
            as: 'drivers',
          },
        },
        {
          $project: {
            _id: 1,
            ownerId: 1,
            type: 1,
            date: 1,
            state: 1,
            city: 1,
            country: 1,
            createdAt: 1,
            status: 1,
            drivers: 1,
          },
        },
      ])
      .exec();
  }

  async updateDriverDetails(
    id: string,
    hours: any,
    trips: any,
    startTime: string,
    endTime: string,
    status: string,
    diaryId: string,
  ): Promise<any> {
    const updateObj: any = {};

    if (hours !== '' && hours != null) {
      updateObj.hours = hours;
    }

    if (trips != null && trips !== '') {
      updateObj.trips = trips;
    }
    if (startTime) {
      updateObj.startTime = startTime;
    }
    if (endTime) {
      updateObj.endTime = endTime;
    }
    if (status) {
      updateObj.status = status;
    }
    console.log(updateObj, hours);
    if (diaryId) {
      return await this.driver
        .updateMany({ diaryId: diaryId }, updateObj, { new: true })
        .exec();
    }
    return await this.driver
      .findByIdAndUpdate(id, updateObj, { new: true })
      .exec();
  }

  async checkUser(phoneNo: number, name: string): Promise<any> {
    const findObj: any = {};
    if (phoneNo) {
      findObj.phone = phoneNo;
    }
    if (name) {
      findObj.name = name;
    }
    const existingData: any = await this.user.find(findObj).catch((err) => {
      console.log(err);
    });

    console.log(existingData);

    if (existingData?.length > 0) {
      const updateObj: any = {
        phone: phoneNo || '',
        name: name || '',
      };
      await this.user.findOneAndUpdate({ phone: phoneNo }, updateObj).exec();
      return existingData[0];
    }

    let newUser: any = {
      name: name || '',
      phone: phoneNo ? phoneNo : '',
      status: 'ACTIVE',
      email: '',
      isAdmin: false,
      city: '',
      state: '',
      country: '',
      image: '',
      isActive: 1,
      createdAt: new Date(),
    };

    newUser = await new this.user(newUser).save();
    return newUser;
  }

  async addDriverLocation(data: any): Promise<any> {
    return await this.driverLocation.create(data);
  }
}
