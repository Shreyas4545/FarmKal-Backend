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
  UseInterceptors,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RentalCategoryService } from '../../service/rental-category/rental-category.service';
import { createRentalCategoryDTO } from '../../dto/rentalCategoryDto/createRentalCategoryDto';
import { updateRentalCategoryDTO } from '../../dto/rentalCategoryDto/updateRentalCategoryDto';
import { ResponseCompo } from '../../utils/response';
import { FirebaseService } from '../../utils/imageUpload';
@Controller('api/rental')
export class RentalCategoryController {
  constructor(
    private readonly rentalCategoryService: RentalCategoryService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
  ) {}

  //Api's for Rental Category
  @Post('/create')
  async createRentalCategory(@Res() response, @Body() data: any) {
    try {
      const newCategory: any = await this.rentalCategoryService.createCategory(
        data,
      );

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Rental Category',
        },
        newCategory,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getRentalCategories')
  // @UseInterceptors(AuthInterceptor)
  async get(@Res() response, @Query('id') id: string, @Body() data: any) {
    try {
      const rentalCategories: any =
        await this.rentalCategoryService.getCategories(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Rental Categories',
        },
        rentalCategories,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateRentalCategory/:id')
  async updateRentalCategory(
    @Res() response,
    @Param('id') id: string,
    @Body() data: updateRentalCategoryDTO,
  ) {
    try {
      const updateRentalService =
        await this.rentalCategoryService.updateRentalCategory(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Updated Rental Category',
        },
        updateRentalService,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  //Api's for Unit Measurement
  @Post('/createUnit')
  async createUnit(@Res() response, @Body() data: any) {
    try {
      const newUnit: any = await this.rentalCategoryService.createUnit(data);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Unit',
        },
        newUnit,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getUnits')
  // @UseInterceptors(AuthInterceptor)
  async getUnits(@Res() response, @Query('id') id: string, @Body() data: any) {
    try {
      const units: any = await this.rentalCategoryService.getUnit(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Units',
        },
        units,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateUnit/:id')
  async updateUnit(
    @Res() response,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    try {
      const updateUnit = await this.rentalCategoryService.updateUnit(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Updated Units',
        },
        updateUnit,
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
