import { Injectable } from '@nestjs/common';
import { OtpDTO } from '../../dto/otpDto/create-otp-dto';
import { IOtp } from '../../interface/otp.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReadOtpDTO } from '../../dto/otpDto/read-otp-Dto';
// import { SmsService } from '../sms/sms.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel('OTP') private otpModel: Model<IOtp>, // private readonly smsService: SmsService,
  ) {}
  async sendOtp(data: OtpDTO): Promise<IOtp | any> {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const obj: any = {
      phone: data?.phone,
      otp: otp,
    };

    // const sms = await this.smsService.sendSms(
    //   data?.phone,
    //   'Welcome to FarmKal! Please Enter Otp to Login',
    // );

    const newOtp = await this.otpModel
      .findOneAndUpdate(
        { phone: obj?.phone },
        { $set: obj },
        { new: true, upsert: true },
      )
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return newOtp;
  }

  async verifyOtp(data: ReadOtpDTO): Promise<boolean | any> {
    const otpDetails: any = await this.otpModel
      .findOne({ phone: data?.phone })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    if (otpDetails.otp != data?.otp) {
      return false;
    }

    return true;
  }
}
