import { CategoryService } from 'src/service/categoryService/category.service';
import { CategoryDTO } from 'src/dto/categoryDto/create-category-dto';
import { updateCategoryDto } from 'src/dto/categoryDto/update-category-dto';
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
import { ResponseCompo } from 'src/utils/response';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/utils/imageUpload';
@Controller('api/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(
    @Res() response,
    @Body() data: CategoryDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileUrl: string = await this.firebaseService.uploadFile(file);
      let newCategory: any = { ...data, image: fileUrl };
      newCategory = await this.categoryService.createCategory(newCategory);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Category',
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

  @Get('/getCategory')
  async getCategory(
    @Res() response,
    @Query('id') id: string,
    @Body() data: any,
  ) {
    try {
      const category: any = await this.categoryService.getCategory(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Categories',
        },
        category,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateCategory/:id')
  async updateCategory(
    @Res() response,
    @Param('id') id: string,
    @Body() data: updateCategoryDto,
  ) {
    try {
      const updatedCategory: any = await this.categoryService.updateCategory(
        id,
        data,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Updated Category',
        },
        updatedCategory,
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
