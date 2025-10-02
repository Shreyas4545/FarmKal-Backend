import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ITransactions } from '../../interface/transaction.interface';
import { IFarmerProfile } from '../../interface/farmerProfile.interface';
import { IPaymentMode } from '../../interface/paymentMode.interface';
import { ILocation } from '../../interface/location.interface';
import { ITotalAmount } from '../../interface/totalAmount.interface';
import { IPayment } from '../../interface/payment.interface';
import { IDiaryInterface } from '../../interface/diaryInterface';
import { IOwnerReminder } from '../../interface/ownerReminder.interface';
import { IUser } from '../../interface/user.interface';
import { IDriver } from '../../interface/driverInterface';
import { IDriverLocation } from '../../interface/driverLocation.interface';
import { ILocationTracking } from '../../interface/locationTrackingInterface';
import { IDriverEntry } from '../../interface/driverEntry.interface';

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
    @InjectModel('DriverEntry')
    private driverEntry: Model<IDriverEntry>,
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
    @InjectModel('LocationTracking')
    private locationTracking: Model<ILocationTracking>,
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
    data?.map((it: any, key) => {
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
    const objectId = customerId
      ? new mongoose.Types.ObjectId(customerId)
      : null;

    const matchStage = customerId
      ? {
          $or: [{ customerId: objectId }, { ownerId: customerId }],
        }
      : {};

    return await this.diary
      .aggregate([
        { $match: matchStage },
        {
          $addFields: {
            ownerId: { $toObjectId: '$ownerId' }, // just in case stored as string
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            customerId: 1,
            ownerId: 1,
            ownerName: '$owner.name',
            customerName: 1,
            type: 1,
            date: 1,
            state: 1,
            city: 1,
            country: 1,
            createdAt: 1,
            latitude: 1,
            longitude: 1,
            status: 1,
          },
        },
      ])
      .exec();
  }

  async updateDiaryStatus(id: string, data: any): Promise<any> {
    const updateObj: any = {};
    const {
      type,
      city,
      state,
      country,
      latitude,
      longitude,
      status,
      customerId,
      customerName,
      date,
      rate,
    } = data;
    if (status) {
      updateObj.status = status;
    }
    if (city) {
      updateObj.city = city;
    }
    if (date) {
      updateObj.date = date;
    }
    if (customerName) {
      updateObj.customerName = customerName;
    }
    if (rate) {
      updateObj.rate = rate;
    }
    if (state) {
      updateObj.state = state;
    }
    if (country) {
      updateObj.country = country;
    }
    if (customerId) {
      updateObj.customerId = customerId;
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

  async getDriverEntryDetails(diaryId: string, driverId: string): Promise<any> {
    const diaryData = await this.diary
      .aggregate([
        {
          $addFields: {
            ownerId: { $toObjectId: '$ownerId' },
          },
        },
        {
          $lookup: {
            from: 'users', // MongoDB collection name
            localField: 'ownerId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $lookup: {
            from: 'users', // MongoDB collection name
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: '$owner' }, // optional: flatten the array if you expect one user
        { $unwind: '$customer' }, // optional: flatten the array if you expect one user
        {
          $match: {
            _id: new mongoose.Types.ObjectId(diaryId),
          },
        },
        {
          $lookup: {
            from: 'drivers',
            let: {
              diaryIdStr: { $toString: '$_id' },
              ...(driverId && {
                incomingDriverId: new mongoose.Types.ObjectId(driverId),
              }),
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$diaryId', '$$diaryIdStr'] },
                      ...(driverId
                        ? [{ $eq: ['$driverId', '$$incomingDriverId'] }]
                        : []),
                    ],
                  },
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
                $lookup: {
                  from: 'driverlocations',
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            {
                              $eq: ['$diaryId', diaryId],
                            },
                            {
                              $eq: ['$driverId', '$driverId'],
                            },
                          ],
                        },
                      },
                    },
                    { $sort: { createdAt: -1 } }, // latest first
                    { $limit: 1 }, // only last one
                  ],
                  as: 'lastLocation',
                },
              },
              {
                $unwind: {
                  path: '$lastLocation',
                  preserveNullAndEmptyArrays: true,
                },
              },
              // 🔹 New lookup into driverEntries (all docs for one driver)
              {
                $lookup: {
                  from: 'driverentries',
                  let: { driverIdStr: { $toString: '$_id' } }, // convert driver._id to string
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$driverDiaryId', '$$driverIdStr'], // match string field
                        },
                      },
                    },

                    {
                      $project: {
                        _id: 1,
                        trips: 1,
                        hours: 1,
                        startTime: 1,
                        endTime: 1,
                        status: 1,
                        tripStatus: 1,
                        createdAt: 1,
                      },
                    },
                  ],
                  as: 'driverEntries',
                },
              },
              {
                $project: {
                  _id: 1,
                  driverId: 1,
                  driverName: 1,
                  status: 1,
                  createdAt: 1,
                  lastLocation: 1,
                  // keep driverEntries array intact
                  driverEntries: {
                    _id: 1,
                    trips: 1,
                    hours: 1,
                    startTime: 1,
                    endTime: 1,
                    status: 1,
                    tripStatus: 1,
                    createdAt: 1,
                  },
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
            ownerName: '$owner.name', // get the owner's name
            customerName: 1,
            customerId: 1,
            state: 1,
            city: 1,
            country: 1,
            createdAt: 1,
            rate: 1,
            status: 1,
            latitude: 1,
            longitude: 1,
            drivers: 1,
          },
        },
      ])
      .exec();

    const locationTrackData = await this.locationTracking
      .findOne({
        status: 'PENDING',
        driverId: driverId,
        diaryId: diaryId,
      })
      .exec();

    const returnObj: any = {
      diaryData: diaryData,
      locationTrackReqPresent: locationTrackData ? true : false,
      locationTrackDataId: locationTrackData?._id,
    };

    return returnObj;
  }

  async getDriverOnlyEntries(driverId?: string): Promise<any> {
    const incomingDriverId = new mongoose.Types.ObjectId(driverId);

    // Part 1: Diaries linked via driver entries
    const diariesLinkedByDriver: any = await this.driver.aggregate([
      { $match: { driverId: incomingDriverId } },
      {
        $group: { _id: '$diaryId', driverName: { $first: '$driverName' } },
      },
      {
        $addFields: {
          _id: { $toObjectId: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'diaries',
          localField: '_id',
          foreignField: '_id',
          as: 'diary',
        },
      },
      { $unwind: '$diary' },
      // { $replaceRoot: { newRoot: '$diary' } },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$diary', { driverName: '$driverName' }],
          },
        },
      },

      // 🔥 Convert ownerId and customerId to ObjectId to match users._id
      {
        $addFields: {
          ownerObjectId: { $toObjectId: '$ownerId' },
          customerObjectId: { $toObjectId: '$customerId' },
        },
      },
      // 🔗 Join with users to get owner info
      {
        $lookup: {
          from: 'users',
          localField: 'ownerObjectId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },

      // 🔗 Join with users to get customer info
      {
        $lookup: {
          from: 'users',
          localField: 'customerObjectId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },

      // 🔥 Finally project to add just ownerName & customerName, keeping all diary fields
      {
        $addFields: {
          ownerName: '$owner.name',
        },
      },

      {
        $project: {
          owner: 0,
          customer: 0,
          ownerObjectId: 0,
          customerObjectId: 0,
        },
      },
    ]);

    const matchStage = { ownerId: driverId };

    // Part 2: Diaries directly owned
    const diariesByOwner: any[] = await this.diary
      .aggregate([
        { $match: matchStage },
        {
          $addFields: {
            ownerId: { $toObjectId: '$ownerId' }, // just in case stored as string
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'ownerId',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            customerId: 1,
            ownerId: 1,
            ownerName: '$owner.name',
            customerName: '$customer.name',
            type: 1,
            date: 1,
            state: 1,
            city: 1,
            country: 1,
            createdAt: 1,
            latitude: 1,
            longitude: 1,
            status: 1,
          },
        },
      ])
      .exec();

    return [...diariesLinkedByDriver, ...diariesByOwner];
  }

  async updateDriverEntryDetails(
    id: string,
    hours: any,
    trips: any,
    startTime: string,
    endTime: string,
    status: string,
    diaryId: string,
    tripStatus: string,
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
    if (tripStatus) {
      updateObj.tripStatus = tripStatus;
    }

    console.log(id, updateObj);
    if (diaryId) {
      await this.driver
        .updateMany({ diaryId }, { status: 'ACTIVE' }, { new: true })
        .exec();

      const allRecords: any[] = await this.driver
        .find({ diaryId })
        .select('_id');

      const ids: any[] = allRecords?.map((r) => r._id.toString());

      return await this.driverEntry.updateMany(
        { driverDiaryId: { $in: ids } },
        { $set: { status: 'ACTIVE' } },
        { new: true },
      );
    }

    return await this.driverEntry.findByIdAndUpdate(id, updateObj, {
      new: true,
    });
  }

  async checkUser(phoneNo: number, name: string): Promise<any> {
    const findObj: any = {};
    if (phoneNo) {
      findObj.phone = phoneNo;
    }

    const existingData: any = await this.user.find(findObj).catch((err) => {
      console.log(err);
    });

    if (existingData?.length > 0) {
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

  // ...existing code...
  async addDriverEntryDetails(data: any): Promise<any> {
    // Ensure driverDiaryId is provided
    const driverDiaryId = data?.driverDiaryId;

    // Fetch existing trip labels for this driverDiaryId
    const existingEntries: any[] = await this.driverEntry
      .find({ driverDiaryId: driverDiaryId })
      .select('tripLabel')
      .lean()
      .catch((err) => {
        console.log(
          'Error fetching existing driver entries for label generation',
          err,
        );
        return [];
      });

    // Determine the highest numeric suffix from labels like "Trip 1", "Trip 2", ...
    let maxNum = 0;
    for (const e of existingEntries) {
      const label = (e?.tripLabel || '').toString();
      const m = label.match(/Trip\s*(\d+)/i);
      if (m && m[1]) {
        const n = parseInt(m[1], 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    }

    // Next label
    const nextNum = maxNum + 1;
    // Use a descriptive field name 'tripLabel' to store the generated value.
    // If callers already provide a tripLabel, do not override.
    if (!data.tripLabel) {
      data.tripLabel = `Trip ${nextNum}`;
    }

    data.createdAt = new Date();

    return await this.driverEntry.create(data);
  }

  async addDriverLocation(data: any): Promise<any> {
    return await this.driverLocation.create(data);
  }

  async getDriverLocationEntries(
    diaryId: string,
    driverId: string,
    driverEntryId?: string,
  ): Promise<any> {
    const matchStage: any = {
      diaryId: diaryId,
      driverId: driverId,
    };

    if (driverEntryId) {
      matchStage.driverEntryId = driverEntryId;
    }

    const agg = await this.driverLocation
      .aggregate([
        { $match: matchStage },
        // convert driverEntryId (string) to ObjectId when present
        {
          $addFields: {
            driverEntryOid: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$driverEntryId', null] },
                    { $ne: ['$driverEntryId', ''] },
                  ],
                },
                { $toObjectId: '$driverEntryId' },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'driverentries',
            localField: 'driverEntryOid',
            foreignField: '_id',
            as: 'driverEntry',
          },
        },
        { $unwind: { path: '$driverEntry', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            diaryId: 1,
            driverId: 1,
            latitude: 1,
            longitude: 1,
            createdAt: 1,
            tripLabel: { $ifNull: ['$driverEntry.tripLabel', 'Unassigned'] },
            trips: '$driverEntry.trips',
            driverEntryId: '$driverEntry._id',
          },
        },
        // group all locations by tripLabel
        {
          $group: {
            _id: '$tripLabel',
            tripLabel: { $first: '$tripLabel' },
            latlong: { $push: '$$ROOT' },
            firstCreatedAt: { $min: '$createdAt' },
          },
        },
        // sort by earliest location time so trips are in natural order
        {
          $sort: { firstCreatedAt: 1 },
        },
        {
          $project: {
            _id: 0,
            tripLabel: 1,
            latlong: 1,
          },
        },
      ])
      .exec();

    return { data: agg };
  }

  async addTrackingReq(data: any): Promise<any> {
    return await this.locationTracking.create(data);
  }

  async updateTrackingRequest(id: string, data: any): Promise<any> {
    return await this.locationTracking
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async deleteDriverEntry(id: string) {
    await this.driverEntry
      .findOneAndDelete({ _id: id })
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return true;
  }

  async deleteDriverDetails(id: string) {
    await this.driver
      .findOneAndDelete({ _id: id })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    await this.driverEntry
      .findOneAndDelete({ driverDiaryId: id })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return true;
  }

  async getCompleteUserDetailsByPhoneSimplified(phoneNo: number): Promise<any> {
    // 1. Get User Details
    const user = await this.user.findOne({ phone: phoneNo }).exec();

    if (!user) {
      throw new Error('User not found');
    }

    // 2. Get Diary Details (as owner)
    const ownedDiaries = await this.getDiaries(user._id.toString());

    // 3. Get Diary Details (as customer)
    const customerDiaries = await this.diary
      .find({
        customerId: user._id,
      })
      .exec();

    // 4. Get Driver Details
    const driverAssignments = await this.driver
      .find({
        driverId: user._id,
      })
      .exec();

    // 5. Get Driver Entries
    const driverEntries = await this.driverEntry
      .find({
        driverDiaryId: { $in: driverAssignments.map((d) => d._id.toString()) },
      })
      .exec();

    return {
      userDetails: user,
      ownedDiaries,
      customerDiaries,
      driverAssignments,
      driverEntries,
    };
  }
}
