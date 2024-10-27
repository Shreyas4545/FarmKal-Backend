import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionsService } from '../../service/transactions/transactions.service';
import { createTransactionDTO } from '../../dto/transactionsDto/createTransaction.dto';
import { ResponseCompo } from '../../utils/response';
import { ImagesService } from '../../service/product-listing-images/product-listing-images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';

@Controller('api/transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly responseCompo: ResponseCompo,
    private readonly imagesService: ImagesService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('files'))
  async createTransactions(
    @Res() response,
    @Body() data: createTransactionDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const farmerProfileData = {
        name: data?.name,
        phoneNo: data?.phoneNo,
        status: 'ACTIVE',
      };
      const farmerProfile = await this.transactionsService.createFarmerProfile(
        farmerProfileData,
      );

      let s3ImageUrls: any = await Promise.all(
        files?.map(
          async (item, key) => await this.firebaseService.uploadFile(item),
        ),
      );

      s3ImageUrls = s3ImageUrls?.map((item, key) => {
        return {
          image: item,
          isActive: true,
        };
      });

      s3ImageUrls = await this.imagesService.addMultipleImage(
        'RentalImages',
        s3ImageUrls,
      );

      const newData = {
        ...data,
        date: new Date(),
        farmerProfileID: farmerProfile?._id,
        rentalImages: s3ImageUrls,
      };

      const newTransaction = await this.transactionsService.create(newData);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Added New Transaction!',
        },
        newTransaction,
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
