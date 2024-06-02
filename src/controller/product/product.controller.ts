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
import { BrandsService } from 'src/service/brands/brands.service';
import { updateBrandDto } from 'src/dto/brandDto/update-brand-dto';
import { createBrandDTO } from 'src/dto/brandDto/create-brand.dto';
import { ResponseCompo } from 'src/utils/response';
import { response } from 'express';

@Controller('api/products')
export class ProductController {
  constructor(
    private readonly brandService: BrandsService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Post('/create')
  async createBrand(@Res() response, @Body() data: createBrandDTO) {
    try {
      const newBrand: any = await this.brandService.createBrand(data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Brand',
        },
        newBrand,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getBrands')
  async get(@Res() response, @Query('id') id: string, @Body() data: any) {
    try {
      const brands: any = await this.brandService.getBrand(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent Brand',
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

  @Put('/updateBrand/:id')
  async updateBrand(
    @Res() response,
    @Param('id') id: string,
    @Body() data: updateBrandDto,
  ) {
    try {
      const updatedBrand = await this.brandService.updateBrand(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Updated Brand',
        },
        updatedBrand,
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
