import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  Query,
  Res,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { ResponseCompo } from '../../utils/response';
import { ConversationsService } from '../../service/conversations/conversations.service';
import { MessagesService } from '../../service/messages/messages.service';
import { IConversation } from '../../interface/conversation.interface';
import { createMessageDto } from '../../dto/conversationDto/message.dto';
import { IMessage } from '../../interface/message.interface';

@Controller('api/conversations')
export class ConversationsController {
  constructor(
    private readonly conversationService: ConversationsService,
    private readonly messageService: MessagesService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Post('/sendMessage')
  async createConversation(
    @Res() response,
    @Body() messageInfo: createMessageDto,
    @Query('conversationId') conversationId: string,
  ) {
    try {
      const currentDate: Date = new Date();
      // eslint-disable-next-line prefer-const
      let messageObj: any = {
        ...messageInfo,
        date: currentDate,
        hours: currentDate.getHours(),
        minutes: currentDate.getMinutes(),
        seconds: currentDate.getSeconds(),
      };

      let conversation: any = {};

      if (conversationId) {
        conversation = await this.conversationService.updateConversation(
          conversationId,
          {
            users: messageInfo?.senderId,
            lastMessage: {
              message: messageInfo?.message,
              senderId: messageInfo?.senderId,
            },
          },
        );
        messageObj.conversationId = conversation?._id;
      } else {
        const conversationObj: any = {
          adminOnly: messageInfo?.adminOnly || false,
          participants: [messageInfo?.senderId, messageInfo?.receiverId],
          createdAt: new Date(),
          lastMessageAt: new Date(),
          lastMessage: {
            message: messageInfo?.message,
            senderId: messageInfo?.senderId,
          },
          isActive: true,
        };
        conversation = await this.conversationService.createConversation(
          conversationObj,
        );

        messageObj.conversationId = conversation?._id;
      }

      const message: IMessage = await this.messageService.createMessage(
        messageObj,
      );

      const participantsData: IConversation[] | any =
        await this.conversationService.checkConversationExistence(
          conversation?.participants[0],
          conversation?.participants[1],
        );

      conversation.participants = participantsData[0]?.participants;
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Message',
        },
        conversationId ? message : conversation,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getConversations')
  async getConversations(@Res() response, @Query('senderId') id: string) {
    try {
      const conversations: IConversation[] =
        await this.conversationService.getConversations(id);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Conversations',
        },
        conversations,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getMessages/:conversationId')
  async getMessages(
    @Res() response,
    @Param('conversationId') conversationId: string,
  ) {
    try {
      const messages: IMessage[] = await this.messageService.getMessages(
        conversationId,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Messages',
        },
        messages,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Delete('/deleteMessage/:conversationId')
  async deleteMessage(@Res() response, @Param('conversationId') id: string) {
    try {
      console.log(id);
      const deletedMessage = await this.messageService.deleteMessage(id);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Deleted Message',
        },
        deletedMessage,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/checkConversation')
  async checkConversationExistence(
    @Res() response,
    @Query('userId1') userId1: string,
    @Query('userId2') userId2: string,
  ) {
    try {
      const checkConversation: IConversation[] | any =
        await this.conversationService.checkConversationExistence(
          userId1,
          userId2,
        );
      return response.status(200).json({
        success: true,
        message: 'Successfully Sent Details',
        data: checkConversation.length > 0 ? checkConversation[0] : null,
      });
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Post('/startConversation')
  async startConversation(
    @Res() response,
    @Query('userId1') userId1: string,
    @Query('userId2') userId2: string,
  ) {
    try {
      const checkConversation: IConversation[] | any =
        await this.conversationService.checkConversationExistence(
          userId1,
          userId2,
        );

      if (checkConversation?.length > 0) {
        return this.responseCompo.successResponse(
          response,
          {
            statusCode: HttpStatus.OK,
            message: 'Conversation between these two users already exists',
          },
          checkConversation,
        );
      }
      const conversationObj: any = {
        adminOnly: false,
        participants: [userId1, userId2],
        createdAt: new Date(),
        isActive: true,
      };

      let conversation: any = await this.conversationService.createConversation(
        conversationObj,
      );

      conversation = await this.conversationService.checkConversationExistence(
        userId1,
        userId2,
      );

      conversation[0].lastMessage = {
        message: '',
        senderId: '',
      };
      conversation[0].lastMessageAt = '';

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Created Conversation',
        },
        conversation[0],
      );
    } catch (err) {
      console.log(err);
    }
  }
}
