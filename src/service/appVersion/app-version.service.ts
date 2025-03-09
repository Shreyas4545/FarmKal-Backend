import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAppVersion } from 'src/interface/appVersion.interface';
import { IPolicy } from 'src/interface/policy.interface';
@Injectable()
export class AppVersionService {
  constructor(
    @InjectModel('appVersion') private appVersionModel: Model<IAppVersion>,
    @InjectModel('PrivacyPolicy') private privacyPolicyModel: Model<IPolicy>,
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

  async getPrivacyPolicy(data): Promise<IPolicy | any> {
    const obj: any = {};
    if (data.name) {
      obj.name = data.name;
    }

    const policy: any = await this.privacyPolicyModel
      .find(obj)
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return policy;
  }

  async addPrivacyPolicy(data: any): Promise<IPolicy | any> {
    const { name, policy } = data;
    const obj: any = {
      policy: policy,
      name: name,
    };

    const newPolicy: any = new this.privacyPolicyModel(obj);

    return await newPolicy.save();
  }
}
