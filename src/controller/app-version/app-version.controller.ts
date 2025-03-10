import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Body,
  Post,
  Query,
} from '@nestjs/common';
import { AppVersionService } from 'src/service/appVersion/app-version.service';
import { ResponseCompo } from 'src/utils/response';

@Controller('api/app-version')
export class AppVersionController {
  constructor(
    private readonly appVersionService: AppVersionService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Get('/appVersionDetails')
  async getAppVersionDetails(@Res() response) {
    try {
      const appVersionDetails: any =
        await this.appVersionService.getAppVersion();
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent App Version Details',
        },
        appVersionDetails[0],
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getPrivacyPolicy')
  async getPrivacyPolicy(@Res() response, @Query('name') name: string) {
    try {
      const obj: any = {
        name: name,
      };
      const privacyPolicy: any = await this.appVersionService.getPrivacyPolicy(
        obj,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent Privacy Policy Details',
        },
        privacyPolicy,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Post('/addPrivacyPolicy')
  async addPrivacyPolicy(@Res() response, @Body() data: any) {
    try {
      const privacyPolicy: any = await this.appVersionService.addPrivacyPolicy(
        data,
      );

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Added Privacy Policy',
        },
        privacyPolicy[0],
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
