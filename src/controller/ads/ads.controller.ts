import { AdsService } from 'src/service/ads/ads.service';
import { AdsDTO } from 'src/dto/adsDto/createAds.dto';
import { updateAdsDto } from 'src/dto/adsDto/update-ads.dto';
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
import { IAds } from 'src/interface/ads.interface';

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
    @Body() data: AdsDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileUrl: string = await this.firebaseService.uploadFile(file);
      let newAd: any = {
        ...data,
        image: fileUrl,
        createdAt: new Date(),
        isActive: true,
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
