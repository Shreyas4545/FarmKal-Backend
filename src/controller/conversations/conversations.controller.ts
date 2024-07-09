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

      if (conversationId) {
        const conversation: IConversation =
          await this.conversationService.updateConversation(conversationId, {
            users: messageInfo?.senderId,
          });

        messageObj.conversationId = conversation?._id;
      } else {
        const conversationObj: any = {
          adminOnly: messageInfo?.adminOnly || false,
          participants: [messageInfo?.senderId],
          createdAt: new Date(),
          lastMessageAt: new Date(),
          isActive: true,
        };
        const conversation: IConversation =
          await this.conversationService.createConversation(conversationObj);

        messageObj.conversationId = conversation?._id;
      }

      const message: IMessage = await this.messageService.createMessage(
        messageObj,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Message',
        },
        message,
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
      const checkConversation: IConversation =
        await this.conversationService.checkConversationExistence(
          userId1,
          userId2,
        );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Conversation',
        },
        checkConversation[0],
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }
}
