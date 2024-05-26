import { Injectable } from '@nestjs/common';
import * as fast2sms from 'fast-two-sms';

@Injectable()
export class SmsService {
  //   private readonly apiKey = process.env.FAST2SMS_API_KEY;

  private readonly apiKey =
    'VGc9NzFShehLbtDyvWGCvSHfu3aytLYihetB9GlKy8AerxjdaNc91HwNIiWT';

  async sendSms(phone: number, message: string): Promise<any> {
    try {
      const response = await fast2sms.sendMessage({
        authorization: this.apiKey,
        message: message,
        numbers: [phone],
      });
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }
}
