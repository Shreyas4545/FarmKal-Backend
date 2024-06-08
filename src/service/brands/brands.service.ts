import { Injectable } from '@nestjs/common';
import { createBrandDTO } from '../../dto/brandDto/create-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBrand } from '../../interface/brand.interface';
import { ICategory } from '../../interface/category.interface';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel('Brand') private brandModel: Model<IBrand>,
    @InjectModel('Category') private categoryModel: Model<ICategory>,
  ) {}

  async createBrand(data: createBrandDTO): Promise<IBrand> {
    const newBrand: any = new this.brandModel(data);
    return await newBrand.save();
  }

  async getBrand(id: string, data: any): Promise<IBrand[]> {
    const obj: any = {};
    const { name, categoryId, isActive } = data;
    if (id) {
      obj._id = id;
    }

    if (categoryId) {
      obj.categoryId = categoryId;
    }

    if (name) {
      obj.name = name;
    }

    if (isActive || isActive === false) {
      obj.isActive = isActive;
    }

    const brand: any = await this.brandModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return brand;
  }

  async updateBrand(id: string, data: any): Promise<IBrand> {
    const obj: any = {};
    const { name, categoryId, description, isActive } = data;

    if (id) {
      obj._id = id;
    }

    if (name) {
      obj.name = name;
    }

    if (categoryId) {
      obj.categoryId = categoryId;
    }

    if (description) {
      obj.description = description;
    }

    if (isActive) {
      obj.isActive = isActive;
    }

    const updatedBrand: any = await this.brandModel
      .findOneAndUpdate({ _id: id }, obj, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return updatedBrand;
  }

  async getCategoriesWithBrands(): Promise<any> {
    const categoriesWithBrands = await this.categoryModel
      .aggregate([
        {
          $lookup: {
            from: 'brands',
            let: { categoryId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toObjectId: '$categoryId' }, '$$categoryId'],
                  },
                },
              },
            ],
            as: 'brands',
          },
        },
      ])
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return categoriesWithBrands;
  }
}
