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
import { ProductService } from '../../service/product/product.service';
import { updateProductDTO } from '../../dto/productDto/update-product-dto';
import { createProductDTO } from '../../dto/productDto/createProduct.dto';
import { ResponseCompo } from '../../utils/response';

@Controller('api/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Post('/create')
  async createProduct(@Res() response, @Body() data: createProductDTO) {
    try {
      const newProduct: any = await this.productService.createProduct(data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Product',
        },
        newProduct,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getProducts')
  async get(@Res() response, @Query('id') id: string, @Body() data: any) {
    try {
      const products: any = await this.productService.getProduct(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent Products',
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

  @Put('/updateProducts/:id')
  async updateProduct(
    @Res() response,
    @Param('id') id: string,
    @Body() data: updateProductDTO,
  ) {
    try {
      const updatedProduct = await this.productService.updateProduct(id, data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Updated Product',
        },
        updatedProduct,
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
