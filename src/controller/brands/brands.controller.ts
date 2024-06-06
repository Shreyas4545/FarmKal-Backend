import {
  Controller,
  Post,
  Get,
  Put,
  Res,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { BrandsService } from '../../service/brands/brands.service';
import { updateBrandDto } from '../../dto/brandDto/update-brand-dto';
import { createBrandDTO } from '../../dto/brandDto/create-brand.dto';
import { ResponseCompo } from '../../utils/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';

@Controller('api/brands')
export class BrandsController {
  constructor(
    private readonly brandService: BrandsService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createBrand(
    @Res() response,
    @Body() data: createBrandDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileUrl: string = await this.firebaseService.uploadFile(file);
      let newBrand: any = { ...data, image: fileUrl };
      newBrand = await this.brandService.createBrand(newBrand);
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

  @Get('/getCategoriesWithBrands')
  async getCategoriesWithBrands(@Res() response) {
    try {
      const categories = await this.brandService.getCategoriesWithBrands();

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Categories',
        },
        categories,
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
