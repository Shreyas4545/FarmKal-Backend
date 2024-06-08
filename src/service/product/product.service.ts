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

    if (isActive) {
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

    const products: any = await this.productModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });

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
