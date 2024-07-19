import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAds } from 'src/interface/ads.interface';
import { AdsDTO } from 'src/dto/adsDto/createAds.dto';

@Injectable()
export class AdsService {
  constructor(@InjectModel('Ads') private adsModel: Model<IAds>) {}

  async createAd(data: AdsDTO): Promise<IAds | any> {
    const newAd: any = new this.adsModel(data);
    return await newAd.save();
  }

  async getAd(id: string, data: any): Promise<IAds | IAds[] | any> {
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

    if (isActive != undefined) {
      obj.isActive = isActive;
    }

    const ads: IAds[] | any = await this.adsModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return ads;
  }

  async getRandomAd(): Promise<IAds | IAds[] | any> {
    const ads: IAds[] | any = await this.adsModel
      .find()
      .exec()
      .catch((err) => {
        console.log(err);
      });

    const randomInt: number = Math.floor(Math.random() * ads?.length);

    return ads[randomInt];
  }

  async updateAd(id: string, data: any): Promise<IAds | IAds[] | any> {
    const { name, description, image, isActive, daysToDisplay } = data;

    const obj: any = {};

    console.log(daysToDisplay);

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

    if (daysToDisplay) {
      obj.daysToDisplay = daysToDisplay;
    }

    const updatedAd = await this.adsModel
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedAd;
  }
}
