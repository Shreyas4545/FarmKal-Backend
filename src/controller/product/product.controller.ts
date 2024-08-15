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
import { ResponseCompo } from '../../utils/response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';
import { ProductListingImagesService } from '../../service/product-listing-images/product-listing-images.service';
import Ably from 'ably';
import { AuthInterceptor } from '../../Interceptors/authentication.interceptor';

@Controller('api/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly responseCompo: ResponseCompo,
    private readonly firebaseService: FirebaseService,
    private readonly imagesService: ProductListingImagesService,
  ) {}

  @Post('/checkAbly')
  async check(@Res() response, @Body() data: any) {
    const { conversationId } = data;

    const ably = new Ably.Realtime(
      'JpheVQ.WC1J-g:qMWX32vzYVAd1_4mQ6etSbjJ3jirOWlUxe6MF6q05vs',
    );

    ably.connection.once('connected', () => {
      console.log('Connected to Ably!');
    });

    // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
    const channel = ably.channels.get('get-started');

    await channel.subscribe(conversationId, (message) => {
      console.log(message?.data);
    });

    await channel.publish(conversationId, 'Hello Its Testing');

    // Close the connection to Ably after a 5 second delay
    setTimeout(async () => {
      ably.connection.close();
      await ably.connection.once('closed', function () {
        console.log('Closed the connection to Ably.');
      });
    }, 5000);

    return this.responseCompo.successResponse(
      response,
      {
        statusCode: HttpStatus.CREATED,
        message: 'Successfully Sent Message',
      },
      'Success',
    );
  }

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

      newProduct = { ...newProduct._doc, images: productListedImages };
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
  // @UseInterceptors(AuthInterceptor)
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

  @Get('/getUserAddedProducts')
  // @UseInterceptors(AuthInterceptor)
  async getUserAddedProducts(
    @Res() response,
    @Query('userId') userId: string,
    @Body() data: any,
  ) {
    try {
      const products: any = await this.productService.getUserAddedProduct(
        userId,
        data,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent User Added Products !',
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

  @Get('/getChatgptRes')
  async getChatGptRes(@Res() response, @Body() data: any) {
    try {
      const apiRes: any = await this.productService.getChatResponse(data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent Products',
        },
        apiRes,
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
