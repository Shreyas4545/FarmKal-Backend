import {
  Controller,
  Post,
  Query,
  Res,
  HttpStatus,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { SocialContentService } from '../../service/social-content/social-content.service';
import { createSocialContentDto } from '../../dto/socialContentDto/create-socialContent.dto';
import { ResponseCompo } from '../../utils/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';
import oneSignal from '../../utils/oneSignalService';

@Controller('api/social-content')
export class SocialContentController {
  constructor(
    private readonly socialContentService: SocialContentService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async addContent(
    @Res() response,
    @Body() data: createSocialContentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileUrl: string = await this.firebaseService.uploadFile(file);
      let newContent: any = { ...data, image: fileUrl };
      newContent = await this.socialContentService.addContent(newContent);

      //call One Signal Notification Service
      await oneSignal('socialContent', '', '', fileUrl, '');
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Added Social Content',
        },
        newContent,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getContent')
  async getContent(
    @Res() response,
    @Query('id') id: string,
    @Query('userId') userId: string,
    data: any,
  ) {
    try {
      const brands: any = await this.socialContentService.getContent(
        id,
        userId,
        data,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent Social Contents',
        },
        brands,
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
