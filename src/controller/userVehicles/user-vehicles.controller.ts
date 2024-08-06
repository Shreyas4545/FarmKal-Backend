import {
  Controller,
  Post,
  Get,
  Put,
  Res,
  Body,
  HttpStatus,
  Param,
  UploadedFiles,
  Query,
  UseInterceptors,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { userVehicleService } from 'src/userVehicles/user-vehicles.service';
import { updateUserVehicleDTO } from 'src/dto/userVehicleDto/updateUserVehicle.dto';
import { ResponseCompo } from '../../utils/response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';
import { AuthInterceptor } from '../../Interceptors/authentication.interceptor';

@Controller('api/userVehicles')
export class userVehiclesController {
  constructor(
    private readonly userVehicleService: userVehicleService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('file'))
  async createUserVehicles(
    @Res() response,
    @Body() data: any,
    @UploadedFiles() file: Express.Multer.File,
  ) {
    try {
      let newUserVehicle: any = {
        ...data,
        image: await this.firebaseService.uploadFile(file),
      };

      newUserVehicle = await this.userVehicleService.createUserVehicles(
        newUserVehicle,
      );

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created User Vehicle',
        },
        newUserVehicle,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getUserVehicles')
  // @UseInterceptors(AuthInterceptor)
  async get(@Res() response, @Query('id') id: string, @Body() data: any) {
    try {
      const products: any = await this.userVehicleService.getUserVehicles(
        id,
        data,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent User Vehicles',
        },
        products,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateUserVehicles/:id')
  async updateUserVehicles(
    @Res() response,
    @Param('id') id: string,
    @Body() data: updateUserVehicleDTO,
  ) {
    try {
      const updateUserVehicle =
        await this.userVehicleService.updateUserVehicles(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Updated User Vehicles',
        },
        updateUserVehicle,
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
