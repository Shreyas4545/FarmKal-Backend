import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductListingImagesService {
  private modelMap: Map<string, Model<any>>;

  constructor(@InjectModel('ProductImages') private imagesModel: Model<any>) {
    this.modelMap = new Map<string, Model<any>>();
    this.modelMap.set('ProductImages', imagesModel);
  }

  async addMultipleImage(modelType: string, data: any[]): Promise<any[]> {
    const currentModel: Model<any> = this.modelMap.get(modelType);
    const images: any = await currentModel.insertMany(
      data?.map((item, key) => ({ item })),
    );
    return images;
  }
}
