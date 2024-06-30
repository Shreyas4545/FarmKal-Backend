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
import { ProductService } from '../../service/product/product.service';
import { updateProductDTO } from '../../dto/productDto/update-product-dto';
import { createProductDTO } from '../../dto/productDto/createProduct.dto';
import { ResponseCompo } from '../../utils/response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';
import { ProductListingImagesService } from 'src/service/product-listing-images/product-listing-images.service';

@Controller('api/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
    private readonly imagesService: ProductListingImagesService,
  ) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('files'))
  async createProduct(
    @Res() response,
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      if (files.length == 0) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Invalid',
        });
      }
      const imgData = [];
      let newProduct: any = await this.productService.createProduct(data);
      const imageUrls: string[] = await Promise.all(
        files?.map(async (item, key) => this.firebaseService.uploadFile(item)),
      );

      imageUrls?.map((item, key) => {
        imgData.push({
          productId: newProduct?._id.toString(),
          imageUrl: item,
        });
      });

      const productListedImages = await this.imagesService.addMultipleImage(
        'ProductImages',
        imgData,
      );

      newProduct = { ...newProduct, images: productListedImages };
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
