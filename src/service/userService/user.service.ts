import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/interface/user.interface';
import { createUserDto } from 'src/dto/userDto/create-user.dto';
import { updateUserDto } from 'src/dto/userDto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async createUser(createUserDto: createUserDto): Promise<IUser | any> {
    const newUser = await new this.userModel(createUserDto);

    return newUser.save();
  }

  async getUser(id: string): Promise<IUser | any> {
    const user = await this.userModel
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

    const users = await this.userModel.find(obj).catch((err) => {
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

    const updatedUser = this.userModel
      .updateOne({ _id: id }, obj, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedUser;
  }
}
