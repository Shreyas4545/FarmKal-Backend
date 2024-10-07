import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRentalCategory } from 'src/interface/rentalCategory.interface';
import { IUser } from 'src/interface/user.interface';

@Injectable()
export class RentalCategoryService {
  constructor(
    @InjectModel('rentalCategory')
    private rentalCategoryModel: Model<IRentalCategory>,
  ) {}

  async createCategory(data: any): Promise<IRentalCategory | any> {
    const { name, isActive } = data;

    let newCategory: any = {
      name: name,
      isActive: isActive,
    };

    newCategory = await new this.rentalCategoryModel(newCategory).save();
    return newCategory;
  }

  async getCategories(
    id: string,
    data: any,
  ): Promise<IRentalCategory | IRentalCategory[] | any> {
    const { name, isActive } = data;

    const obj: any = {};

    if (id) {
      obj._id = id;
    }

    if (isActive != undefined) {
      obj.isActive = isActive;
    }

    if (name) {
      obj.name = name;
    }

    const rentalCategories: any = await this.rentalCategoryModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return rentalCategories;
  }

  async updateRentalCategory(
    id: string,
    data: any,
  ): Promise<IRentalCategory | IRentalCategory[] | any> {
    const { isActive, name } = data;

    const obj: any = {};

    if (name) {
      obj.name = name;
    }

    if (isActive != undefined) {
      obj.isActive = isActive;
    }

    const updatedUserVehicle = await this.rentalCategoryModel
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedUserVehicle;
  }
}
