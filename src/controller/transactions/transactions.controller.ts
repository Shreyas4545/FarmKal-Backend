import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
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
import oneSignal from '../../utils/oneSignalService';
import { UserService } from '../../service/userService/user.service';

interface paymentMode {
  method: string;
}
@Controller('api/rental/transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly responseCompo: ResponseCompo,
    private readonly imagesService: ImagesService,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('files'))
  async createTransactions(
    @Res() response,
    @Body() data: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const farmerProfileData = {
        name: data?.name,
        phoneNo: data?.phoneNo,
        status: 'ACTIVE',
        isValidated: false,
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
        farmerName: data?.name,
        farmerPhone: data?.phoneNo,
        date: new Date(),
        farmerProfileID: farmerProfile?._id,
        rentalImages: s3ImageUrls,
      };

      const newTransaction = await this.transactionsService.create(newData);

      const farmer = await this.userService.getUsers({
        phone: data?.farmerPhone,
      });

      const owner = await this.userService.getUser(data?.ownerId);

      if (farmer?.length > 0) {
        await oneSignal(
          'message',
          `${owner?.name} has created a transaction.`,
          `${data?.totalAmount} Pending`,
          '',
          farmer[0]?._id,
        );
      } else {
        await oneSignal(
          'message',
          'Farmer is not registered.',
          'Please contact them to register',
          '',
          data?.ownerId,
        );
      }

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

  @Get('/getFarmerProfiles')
  async getFarmerProfiles(@Res() response, @Query('phoneNo') phoneNo: number) {
    try {
      const data = await this.transactionsService.getFarmerProfile({
        phoneNo: phoneNo,
      });

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Farmer Profiles!',
        },
        data,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Post('/addPaymentMode')
  async addPaymentMode(@Res() response, @Body() data: paymentMode) {
    const { method } = data;

    try {
      const obj = {
        method: method,
        isActive: true,
      };

      const newPaymentMode = await this.transactionsService.addPaymentMode(obj);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Added New Payment Mode!',
        },
        newPaymentMode,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getPaymentMode')
  async getPaymentMode(@Res() response, @Query('id') id: string) {
    try {
      const data = await this.transactionsService.getPaymentTypes(id);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Payment Modes!',
        },
        data,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getOwnerTransactions')
  async getOwnerTransactions(
    @Res() response,
    @Query('ownerId') ownerId: string,
  ) {
    try {
      const data = await this.transactionsService.getOwnerTransactions(ownerId);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Owner Transactions!',
        },
        data,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getAllTransactions')
  async getAllTransactions(
    @Res() response,
    @Query('ownerId') ownerId: string,
    @Query('farmerProfileId') farmerProfileId: string,
    @Query('paymentType') paymentType: string,
    @Query('rentalCategoryId') rentalCategoryId: string,
  ) {
    try {
      const nextData = {
        ownerId: ownerId,
        farmerProfileId: farmerProfileId,
        paymentType: paymentType,
        rentalCategoryId: rentalCategoryId,
      };
      const data = await this.transactionsService.getAllTransactions(nextData);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent All Transactions!',
        },
        data,
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
