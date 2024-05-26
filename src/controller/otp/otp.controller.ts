import { OtpService } from 'src/service/otp/otp.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { OtpDTO } from 'src/dto/otpDto/create-otp-dto';
import { ResponseCompo } from 'src/utils/response';

@Controller('otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Post('/sendOtp')
  async createOtp(@Res() response, @Body() data: OtpDTO) {
    try {
      const otpDetails = await this.otpService.sendOtp(data);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Otp',
        },
        otpDetails,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
