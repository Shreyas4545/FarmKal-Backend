import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAppVersion } from 'src/interface/appVersion.interface';

@Injectable()
export class AppVersionService {
  constructor(
    @InjectModel('appVersion') private appVersionModel: Model<IAppVersion>,
  ) {}
  async getAppVersion(): Promise<IAppVersion | any> {
    const appVersionDetails: any = await this.appVersionModel
      .find()
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return appVersionDetails;
  }
}
