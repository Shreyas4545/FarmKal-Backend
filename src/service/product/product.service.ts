import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IProduct } from 'src/interface/product.interface';
import { createProductDTO } from 'src/dto/productDto/createProduct.dto';
@Injectable()
export class ProductService {
  constructor(@InjectModel('Product') private productModel: Model<IProduct>) {}

  async createProduct(data: createProductDTO): Promise<IProduct | any> {
    const newProduct: any = new this.productModel(data);
    return await newProduct.save();
  }

  async getProduct(
    id: string,
    data: any,
  ): Promise<IProduct | IProduct[] | any> {
    const {
      additionalFields,
      price,
      categoryId,
      brandId,
      locationId,
      modelId,
      manufacturingYear,
      isActive,
      userId,
    } = data;

    const obj: any = {};

    if (id) {
      obj._id = id;
    }

    if (additionalFields) {
      obj.additionalFields = additionalFields;
    }

    if (price) {
      obj.price = price;
    }

    if (categoryId) {
      obj.categoryId = categoryId;
    }

    if (brandId) {
      obj.brandId = brandId;
    }

    if (isActive || isActive === false) {
      obj.isActive = isActive;
    }

    if (modelId) {
      obj.modelId = modelId;
    }

    if (manufacturingYear) {
      obj.manufacturingYear = manufacturingYear;
    }

    if (locationId) {
      obj.locationId = locationId;
    }

    if (userId) {
      obj.userId = userId;
    }

    const products: any = await this.productModel
      .aggregate([
        {
          $addFields: {
            categoryId: { $toObjectId: '$categoryId' },
            brandId: { $toObjectId: '$brandId' },
            locationId: { $toObjectId: '$locationId' },
            modelId: { $toObjectId: '$modelId' },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        {
          $unwind: '$categoryDetails',
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'brandId',
            foreignField: '_id',
            as: 'brandDetails',
          },
        },
        {
          $unwind: '$brandDetails',
        },
        {
          $lookup: {
            from: 'locations',
            localField: 'locationId',
            foreignField: '_id',
            as: 'locationDetails',
          },
        },
        {
          $unwind: '$locationDetails',
        },
        {
          $lookup: {
            from: 'models',
            localField: 'modelId',
            foreignField: '_id',
            as: 'modelDetails',
          },
        },
        {
          $unwind: '$modelDetails',
        },
        {
          $project: {
            price: 1,
            manufacturingYear: 1,
            isActive: 1,
            additionalFields: 1,
            categoryDetails: 1,
            brandDetails: 1,
            locationDetails: 1,
            modelDetails: 1,
          },
        },
      ])
      .exec()
      .catch((err) => {
        console.log(err);
      });

    console.log(products);
    return products;
  }

  async updateProduct(
    id: string,
    data: any,
  ): Promise<IProduct | IProduct[] | any> {
    const {
      additionalFields,
      price,
      categoryId,
      brandId,
      locationId,
      modelId,
      manufacturingYear,
      isActive,
      userId,
    } = data;

    const obj: any = {};

    if (additionalFields) {
      obj.additionalFields = additionalFields;
    }

    if (price) {
      obj.price = price;
    }

    if (categoryId) {
      obj.categoryId = categoryId;
    }

    if (brandId) {
      obj.brandId = brandId;
    }

    if (isActive) {
      obj.isActive = isActive;
    }

    if (modelId) {
      obj.modelId = modelId;
    }

    if (userId) {
      obj.userId = userId;
    }

    if (manufacturingYear) {
      obj.manufacturingYear = manufacturingYear;
    }

    if (locationId) {
      obj.locationId = locationId;
    }

    const updatedProduct = await this.productModel
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedProduct;
  }
}
