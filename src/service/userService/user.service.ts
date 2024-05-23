import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/interface/user.interface';
import { createUserDto } from 'src/dto/userDto/create-user.dto';

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
}
