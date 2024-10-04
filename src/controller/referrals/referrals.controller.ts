import {
  Controller,
  Post,
  Get,
  Put,
  Res,
  Body,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ReferralsService } from '../../service/referrals/referrals.service';
import { updateReferralsDto } from '../../dto/referrals/updateReferrals.dto';
import { ResponseCompo } from '../../utils/response';
import { AuthInterceptor } from '../../Interceptors/authentication.interceptor';
import { createReferralDTO } from '../../dto/referrals/createReferrals.dto';

@Controller('api/referrals')
export class referralsController {
  constructor(
    private readonly referralsService: ReferralsService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Post('/create')
  async createReferrals(@Res() response, @Body() data: createReferralDTO) {
    try {
      const newReferral = this.referralsService.create(data);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Added Referral Count!',
        },
        newReferral,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getReferrals')
  // @UseInterceptors(AuthInterceptor)
  async get(
    @Res() response,
    @Query('referralOwnerId') referralOwnerId: string,
  ) {
    try {
      const referrals: any = await this.referralsService.getReferrals(
        referralOwnerId,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent Referral Details',
        },
        referrals,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateReferrals/:id')
  async updateReferrals(
    @Res() response,
    @Param('id') id: string,
    @Body() data: updateReferralsDto,
  ) {
    try {
      const updatedReferral = await this.referralsService.update(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Updated Referral Contact',
        },
        updatedReferral,
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
