import { Injectable } from '@nestjs/common';
import { createModelDTO } from '../../dto/modelDto/create-model.dto';
import { updateModelDTO } from '../../dto/modelDto/update-model.to';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IModel } from '../../interface/model.interface';

@Injectable()
export class ModelsService {
  constructor(@InjectModel('Model') private modelModel: Model<IModel>) {}

  async createModel(data: createModelDTO): Promise<IModel> {
    const newModel: any = new this.modelModel(data);
    return await newModel.save();
  }

  async getModel(id: string, data: any): Promise<IModel[]> {
    const obj: any = {};
    const { name, categoryId, description, isActive, brandId } = data;
    if (id) {
      obj._id = id;
    }

    console.log(brandId);

    if (categoryId) {
      obj.categoryId = categoryId;
    }

    if (brandId) {
      obj.brandId = brandId;
    }

    if (name) {
      obj.name = name;
    }

    if (description) {
      obj.description = description;
    }

    if (isActive || isActive === false) {
      obj.isActive = isActive;
    }

    const models: any = await this.modelModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return models;
  }

  async updateModel(id: string, data: any): Promise<IModel> {
    const obj: any = {};
    const { name, categoryId, description, isActive, brandId, image } = data;

    if (id) {
      obj._id = id;
    }

    if (name) {
      obj.name = name;
    }

    if (categoryId) {
      obj.categoryId = categoryId;
    }

    if (brandId) {
      obj.brandId = brandId;
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

    const updateModel: any = await this.modelModel
      .findOneAndUpdate({ _id: id }, obj, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return updateModel;
  }
}
