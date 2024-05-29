import { CategoryService } from 'src/service/categoryService/category.service';
import { CategoryDTO } from 'src/dto/categoryDto/create-category-dto';
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
import { ResponseCompo } from 'src/utils/response';
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Post('/create')
  async createCategory(@Res() response, @Body() data: CategoryDTO) {
    try {
      const newCategory: any = await this.categoryService.createCategory(data);

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
    @Param('id') id: string,
    @Body() data: any,
  ) {
    try {
      const category: any = await this.categoryService.getCategory(id, data);
      console.log(category);
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
}
