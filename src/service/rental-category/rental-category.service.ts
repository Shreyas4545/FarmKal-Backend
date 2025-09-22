import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRentalCategory } from '../../interface/rentalCategory.interface';
import { IUnit } from '../../interface/IUnitMeasurement.interface';

@Injectable()
export class RentalCategoryService {
  constructor(
    @InjectModel('rentalCategory')
    private rentalCategoryModel: Model<IRentalCategory>,
    @InjectModel('unitMeasurement')
    private unitModel: Model<IUnit>,
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

    // if (isActive != undefined) {
    //   obj.isActive = isActive;
    // }
    obj.isActive = true;

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

  async createUnit(data: any): Promise<IUnit | any> {
    const { title, category, isActive } = data;

    let newUnit: any = {
      title: title,
      category: category,
      isActive: isActive,
    };

    newUnit = await new this.unitModel(newUnit).save();
    return newUnit;
  }

  async getUnit(id: string, data: any): Promise<IUnit | IUnit[] | any> {
    const { title, category, isActive } = data;

    const obj: any = {};

    if (id) {
      obj._id = id;
    }

    if (isActive != undefined) {
      obj.isActive = isActive;
    }

    if (title) {
      obj.title = title;
    }

    if (category) {
      obj.category = category;
    }

    const units: any = await this.unitModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return units;
  }

  async updateUnit(id: string, data: any): Promise<IUnit | IUnit[] | any> {
    const { isActive, title, category } = data;

    const obj: any = {};

    if (title) {
      obj.title = title;
    }
    if (category) {
      obj.category = category;
    }

    if (isActive != undefined) {
      obj.isActive = isActive;
    }

    const updatedUnit = await this.unitModel
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedUnit;
  }
}
