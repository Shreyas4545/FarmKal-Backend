import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICategory } from 'src/interface/category.interface';
import { CategoryDTO } from 'src/dto/categoryDto/create-category-dto';
import { updateCategoryDto } from 'src/dto/categoryDto/update-category-dto';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private categoryModel: Model<ICategory>,
  ) {}

  async createCategory(data: CategoryDTO): Promise<ICategory | any> {
    console.log(data);
    const newCategory: any = new this.categoryModel(data);
    return await newCategory.save();
  }

  async getCategory(
    id: string,
    data: any,
  ): Promise<ICategory | ICategory[] | any> {
    const { name, description, image, isActive } = data;

    const obj: any = {};

    if (id) {
      obj._id = id;
    }

    if (name) {
      obj.name = name;
    }

    if (description) {
      obj.description = description;
    }

    if (image) {
      obj.image = image;
    }

    if (isActive) {
      obj.isActive = isActive;
    }

    const categories = await this.categoryModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return categories;
  }

  async updateCategory(
    id: string,
    data: updateCategoryDto,
  ): Promise<ICategory | ICategory[] | any> {
    const { name, description, image, isActive } = data;

    const obj: any = {};

    if (name) {
      obj.name = name;
    }

    if (description) {
      obj.description = description;
    }

    if (image) {
      obj.image = image;
    }

    if (isActive) {
      obj.isActive = isActive;
    }

    const updatedCategory = await this.categoryModel
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedCategory;
  }
}
