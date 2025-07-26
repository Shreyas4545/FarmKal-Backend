import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IUser } from '../../interface/user.interface';
import { createUserDto } from '../../dto/userDto/create-user.dto';
import { OtpService } from '../otp/otp.service';
import { JwtGenerate } from '../../utils/jwt.token';
interface Login extends Document {
  phone: number;
  isAdmin: boolean;
}
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtGenerate,
    private otpService: OtpService,
  ) {}

  async createUser(createUserDto: createUserDto): Promise<IUser> {
    const newUser: any = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async getUser(id: string): Promise<IUser | any> {
    const user: any = await this.userModel
      .findById(id)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return user;
  }

  async getUsers(data: any): Promise<IUser[] | any> {
    const obj: any = {};
    const { phone, city, isAdmin, isActive, isVisible, referralId } = data;
    if (phone) {
      obj.phone = phone;
    }

    if (city) {
      obj.city = new RegExp(`^${city}$`, 'i');
    }
    if (isAdmin) {
      obj.isAdmin = isAdmin;
    }
    if (referralId) {
      obj.referralId = referralId;
    }
    if (isVisible) {
      obj.isVisible = isVisible;
    }
    if (isActive || isActive === false) {
      obj.isActive = isActive;
    }

    const users: any = await this.userModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return users;
  }

  async deleteUser(id: string): Promise<any> {
    await this.userModel
      .findByIdAndDelete(id)
      .exec()
      .catch((err) => {
        console.log(err);
        return false;
      });
    return true;
  }

  async updateUsers(id: string, data: any): Promise<IUser | any> {
    const obj: any = {};
    const {
      name,
      email,
      phone,
      state,
      city,
      image,
      country,
      isAdmin,
      isActive,
      isVisible,
    } = data;

    if (name) {
      obj.name = name;
    }

    if (email) {
      obj.email = email;
    }
    if (image) {
      obj.image = image;
    }

    if (phone) {
      obj.phone = phone;
    }

    if (state) {
      obj.state = state;
    }

    if (city) {
      obj.city = city;
    }

    if (country) {
      obj.country = country;
    }

    if (isAdmin) {
      obj.isAdmin = isAdmin;
    }

    if (isVisible) {
      obj.isVisible = isVisible;
    }

    if (isActive || isActive == false) {
      obj.isActive = isActive;
    }

    const updatedUser: any = this.userModel
      .findOneAndUpdate({ _id: id }, obj, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedUser;
  }

  async addImage(id: string, data: any): Promise<IUser | any> {
    const obj: any = {};
    const { image } = data;

    obj.image = image;

    const updatedUser: any = this.userModel
      .findOneAndUpdate({ _id: id }, obj, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedUser;
  }

  async login(user: any): Promise<string | boolean> {
    // if (!(await this.otpService.verifyOtp(user))) {
    //   return false;
    // }

    const payload: Login | any = { phone: user.phone, isAdmin: user?.isAdmin };
    const access_token: string | any = await this.jwtService
      .generateToken(payload)
      .catch((err) => {
        console.log(err);
      });

    return access_token;
  }

  async getUserProfileData(userId: string): Promise<string | boolean | any> {
    const userDetails = await this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }, // Convert string ID to ObjectId
      },
      {
        $addFields: {
          _id: {
            $toString: '$_id',
          },
        },
      },
      {
        $lookup: {
          from: 'transactions',
          localField: '_id', // Match with the _id of the user
          foreignField: 'ownerId', // Field in transactions collection
          as: 'transactionDetails', // Output array of transactions
        },
      },
      {
        $lookup: {
          from: 'ownerreminders',
          localField: '_id',
          foreignField: 'ownerId',
          as: 'reminderDetails',
        },
      },
      {
        $addFields: {
          transactionDetails: {
            $map: {
              input: '$transactionDetails',
              as: 'transaction',
              in: {
                _id: '$$transaction._id',
                paymentType: '$$transaction.paymentType',
                totalAmount: '$$transaction.totalAmount',
                noOfUnits: '$$transaction.noOfUnits',
                isVerified: '$$transaction.isVerified',
                ownerId: {
                  $toObjectId: '$$transaction.ownerId',
                },
                farmerProfileId: '$$transaction.farmerProfileID',
                farmerProfileId1: {
                  $toString: '$$transaction.farmerProfileID',
                },
                rentalCategoryId: {
                  $toObjectId: '$$transaction.rentalCategoryId',
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'rentalcategories',
          localField: 'transactionDetails.rentalCategoryId', // Field in transactions after $addFields
          foreignField: '_id', // Match with _id in rentalcategories
          as: 'rentalCategoryDetails', // Output array of rental categories
        },
      },
      {
        $lookup: {
          from: 'farmerprofiles',
          localField: 'transactionDetails.farmerProfileId', // Field in transactions after $addFields
          foreignField: '_id', // Match with _id in rentalcategories
          as: 'farmerProfileDetails', // Output array of rental categories
        },
      },
      {
        $addFields: {
          transactionDetails: {
            $map: {
              input: '$transactionDetails',
              as: 'transaction',
              in: {
                _id: '$$transaction._id',
                ownerId: '$$transaction.ownerId',
                paymentType: '$$transaction.paymentType',
                isVerified: '$$transaction.isVerified',
                totalAmount: '$$transaction.totalAmount',
                noOfUnits: '$$transaction.noOfUnits',
                farmerProfileId: '$$transaction.farmerProfileId',
                rentalCategoryId: '$$transaction.rentalCategoryId',
                rentalCategoryName: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$rentalCategoryDetails',
                        as: 'category',
                        cond: {
                          $eq: [
                            '$$category._id',
                            '$$transaction.rentalCategoryId',
                          ],
                        },
                      },
                    },
                    0,
                  ],
                },
                farmerProfileDetails: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$farmerProfileDetails',
                        as: 'farmerProfile',
                        cond: {
                          $eq: [
                            '$$farmerProfile._id',
                            '$$transaction.farmerProfileId',
                          ],
                        },
                      },
                    },
                    0,
                  ],
                },
                reminderDetails: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$reminderDetails',
                        as: 'reminder',
                        cond: {
                          $eq: [
                            '$$transaction.farmerProfileId1',
                            '$$reminder.farmerProfileId',
                          ],
                        },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          state: 1,
          city: 1,
          country: 1,
          image: 1,
          createdAt: 1,
          transactionDetails: 1,
        },
      },
    ]);

    return userDetails;
  }
}
