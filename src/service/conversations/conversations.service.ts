import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IConversation } from '../../interface/conversation.interface';
@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel('Conversation')
    private conversationModel: Model<IConversation>,
  ) {}

  async createConversation(data: any): Promise<IConversation> {
    const conversation: IConversation = new this.conversationModel(data);
    return await conversation.save();
  }

  async getConversations(id: string): Promise<any> {
    const conversations: IConversation[] | any = await this.conversationModel
      .aggregate([
        {
          $match: {
            participants: id,
          },
        },
        {
          $addFields: {
            participantsObjectIds: {
              $map: {
                input: '$participants',
                as: 'participant',
                in: { $toObjectId: '$$participant' },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'participantsObjectIds',
            foreignField: '_id',
            as: 'participants',
          },
        },
        {
          $project: {
            participants: 1,
            lastMessage: 1,
            lastMessageAt: 1,
            isActive: 1,
            adminOnly: 1,
            createdAt: 1,
          },
        },
      ])
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return conversations;
  }

  async updateConversation(
    conversationId: string,
    data: any,
  ): Promise<IConversation> {
    // eslint-disable-next-line prefer-const
    let newData: any = { lastMessageAt: new Date() };
    if (data?.isActive != undefined) {
      newData.isActive = data?.isActive;
    }

    if (data?.adminOnly != undefined) {
      newData.adminOnly = data?.adminOnly;
    }

    if (data?.lastMessage != undefined) {
      newData.lastMessage = data?.lastMessage;
    }

    const updatedConversation: any = await this.conversationModel
      .findOneAndUpdate(
        { _id: conversationId },
        { $addToSet: { participants: data?.users }, $set: newData },
        { new: true },
      )
      .exec()
      .catch((err) => {
        console.log(err);
      });
    return updatedConversation;
  }

  async checkConversationExistence(
    userId1: string,
    userId2: string,
  ): Promise<IConversation> {
    const existingConversation: any = await this.conversationModel
      .find({
        $and: [{ participants: userId1 }, { participants: userId2 }],
      })
      .exec()
      .catch((err) => {
        console.log(err);
      });

    return existingConversation;
  }
}
