import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IMessage } from '../../interface/message.interface';
import { createMessageDto } from '../../dto/conversationDto/message.dto';

@Injectable()
export class MessagesService {
  constructor(@InjectModel('Message') private messageModel: Model<IMessage>) {}

  async createMessage(data: createMessageDto): Promise<IMessage | any> {
    const message: IMessage = new this.messageModel(data);
    return await message.save();
  }

  async updateMessage(messageId: string, data: any): Promise<IMessage | any> {
    const currentDate: Date = new Date();
    const newData: any = {
      ...data,
      date: new Date(),
      hours: currentDate.getHours(),
      minutes: currentDate.getMinutes(),
      seconds: currentDate.getSeconds(),
    };

    const updatedMessage: any = await this.messageModel
      .findOneAndUpdate({ _id: messageId }, newData, { new: true })
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return updatedMessage;
  }

  async deleteMessage(messageId: string) {
    const deletedMessage: any = await this.messageModel
      .findOneAndDelete({ _id: messageId })
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return deletedMessage;
  }

  async getMessages(conversationId: string): Promise<IMessage[]> {
    const conversationObjectId = new mongoose.Types.ObjectId(conversationId);

    const messages: any = await this.messageModel
      .find({
        conversationId: conversationObjectId,
      })
      .sort({ hours: 1, minutes: 1, seconds: 1 })
      .exec()
      .catch((err) => {
        console.log(err);
      });
    console.log(messages);
    return messages;
  }
}
