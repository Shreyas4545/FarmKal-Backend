import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../interface/user.interface';
import { createUserDto } from '../../dto/userDto/create-user.dto';
import { updateUserDto } from '../../dto/userDto/update-user.dto';
import { OtpService } from '../otp/otp.service';
import { JwtGenerate } from '../../utils/jwt.token';

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
    const { phone, city, isAdmin, isActive, isVisible } = data;
    if (phone) {
      obj.phone = phone;
    }

    if (city) {
      obj.city = new RegExp(`^${city}$`, 'i');
    }
    if (isAdmin) {
      obj.isAdmin = isAdmin;
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

  async updateUsers(id: string, data: any): Promise<IUser | any> {
    const obj: any = {};
    const {
      name,
      email,
      phone,
      state,
      city,
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

  async login(user: any): Promise<string | boolean> {
    if (!(await this.otpService.verifyOtp(user))) {
      return false;
    }

    const payload = { phone: user.phone, isAdmin: user?.isAdmin };
    const access_token: any = this.jwtService
      .generateToken(payload)
      .catch((err) => {
        console.log(err);
      });

    return access_token;
  }
}
