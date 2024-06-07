import { LocationService } from '../../service/locations/locations.service';
import { LocationDTO } from '../../dto/locationDto/createLocation.dto';
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
@Controller('api/location')
export class LocationsController {
  constructor(
    private readonly locationService: LocationService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createLocation(
    @Res() response,
    @Body() data: LocationDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileUrl: string = await this.firebaseService.uploadFile(file);
      let newLocation: any = { ...data, image: fileUrl };
      console.log(newLocation);
      newLocation = await this.locationService.createLocation(newLocation);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Location',
        },
        newLocation,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getLocation')
  async getLocation(
    @Res() response,
    @Query('id') id: string,
    @Body() data: any,
  ) {
    try {
      const location: any = await this.locationService.getLocation(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Locations',
        },
        location,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateLocation/:id')
  async updateLocation(
    @Res() response,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    try {
      const updatedLocation: any = await this.locationService.updateLocation(
        id,
        data,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Updated Location',
        },
        updatedLocation,
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
