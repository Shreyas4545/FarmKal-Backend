import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseService } from '../../utils/imageUpload';

@Injectable()
export class ImagesService {
  private modelMap: Map<string, Model<any>>;

  constructor(
    @InjectModel('ProductImages') private imagesModel: Model<any>,
    @InjectModel('RentalImages') private rentalImagesModel: Model<any>,
    private readonly firebaseService: FirebaseService,
  ) {
    this.modelMap = new Map<string, Model<any>>();
    this.modelMap.set('ProductImages', imagesModel);
    this.modelMap.set('RentalImages', rentalImagesModel);
  }

  async addMultipleImage(modelType: string, data: any[]): Promise<any[]> {
    const currentModel: Model<any> = this.modelMap.get(modelType);
    const images: any = await currentModel.insertMany(data).catch((err) => {
      console.log(err);
    });
    return images;
  }

  async deleteImage(modelType: string, id: string): Promise<any> {
    const currentModel: Model<any> = this.modelMap.get(modelType);
    const deletedImage: any = await currentModel
      .findOneAndDelete({ _id: id })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    await this.firebaseService.deleteImage(
      deletedImage?.imageUrl?.split('/')[
        deletedImage?.imageUrl?.split('/')?.length - 1
      ],
    );
    return deletedImage;
  }
}
