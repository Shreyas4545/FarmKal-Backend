import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ILocation } from '../../interface/location.interface';
import { LocationDTO } from '../../dto/locationDto/createLocation.dto';
@Injectable()
export class LocationService {
  constructor(
    @InjectModel('Location') private locationModel: Model<ILocation>,
  ) {}

  async createLocation(data: LocationDTO): Promise<ILocation | any> {
    const newLocation: any = new this.locationModel(data);
    return await newLocation.save();
  }

  async getLocation(
    id: string,
    data: any,
  ): Promise<ILocation | ILocation[] | any> {
    const { name, description, type, image, isActive } = data;

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

    if (type) {
      obj.type = new RegExp(`^${type}$`, 'i');
    }

    const locations = await this.locationModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return locations;
  }

  async updateLocation(
    id: string,
    data: any,
  ): Promise<ILocation | ILocation[] | any> {
    const { name, description, image, type, isActive } = data;

    const obj: any = {};

    if (name) {
      obj.name = name;
    }

    if (description) {
      obj.description = description;
    }

    if (type) {
      obj.type = type;
    }

    if (image) {
      obj.image = image;
    }

    if (isActive) {
      obj.isActive = isActive;
    }

    const updatedLocation = await this.locationModel
      .findOneAndUpdate({ _id: id }, { $set: obj }, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return updatedLocation;
  }
}
