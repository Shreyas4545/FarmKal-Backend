import { AdsService } from '../../service/ads/ads.service';
import { AdsDTO } from '../../dto/adsDto/createAds.dto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { ResponseCompo } from '../../utils/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';
import { IAds } from '../../interface/ads.interface';

@Controller('api/ads')
export class AdsController {
  constructor(
    private readonly adsService: AdsService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createAds(
    @Res() response,
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileUrl: string = await this.firebaseService.uploadFile(file);
      const currentDate: Date = new Date();

      // Add 15 days to the current date
      const newDate: Date = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + parseInt(data?.daysToDisplay));

      let newAd: any = {
        ...data,
        image: fileUrl,
        createdAt: new Date(),
        isActive: true,
        isPhoto: false,
        expiryAt: newDate,
      };
      newAd = await this.adsService.createAd(newAd);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Ad',
        },
        newAd,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getAds')
  async getAds(@Res() response, @Query('id') id: string, @Body() data: any) {
    try {
      const ad: IAds[] = await this.adsService.getAd(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Ads',
        },
        ad,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getRandomAd')
  async getRandomAds(@Res() response) {
    try {
      const ad: IAds = await this.adsService.getRandomAd();
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Random Ad',
        },
        ad,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateAd/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateAds(@Res() response, @Param('id') id: string, @Body() data: any) {
    try {
      const updatedAd: IAds = await this.adsService.updateAd(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Updated Ad',
        },
        updatedAd,
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
