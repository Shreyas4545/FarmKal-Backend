import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { IUser } from 'src/interface/user.interface';
import { createUserDto } from 'src/dto/userDto/create-user.dto';
import { updateUserDto } from 'src/dto/userDto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  async createUser(createUserDto: createUserDto): Promise<IUser> {
    const newUser = new this.userModel(createUserDto);

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
    if (isActive) {
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

  async updateUsers(
    id: string,
    updateUserDto: updateUserDto,
  ): Promise<IUser | any> {
    const obj: any = {};
    const { name, email, phone, city, isAdmin, isActive, isVisible } =
      updateUserDto;

    if (name) {
      obj.name = name;
    }
    if (email) {
      obj.email = email;
    }
    if (phone) {
      obj.phone = phone;
    }
    if (city) {
      obj.city = city;
    }
    if (isAdmin) {
      obj.isAdmin = isAdmin;
    }
    if (isVisible) {
      obj.isVisible = isVisible;
    }
    if (isActive) {
      obj.isActive = isActive;
    }

    const updatedUser: any = this.userModel
      .updateOne({ _id: id }, obj, { new: true })
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
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '60m',
    });

    return access_token;
  }
}
