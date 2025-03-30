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
import { ResponseCompo } from '../../utils/response';
import { ImagesService } from '../../service/product-listing-images/product-listing-images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';
import oneSignal from '../../utils/oneSignalService';
import { UserService } from '../../service/userService/user.service';

interface paymentMode {
  method: string;
}

interface paymentData {
  totalAmountId: string;
  amount: number;
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
        farmerPhone: data?.farmerPhone,
        date: new Date(),
        farmerProfileID: farmerProfile?._id,
        rentalImages: s3ImageUrls,
      };

      let newTransaction = await this.transactionsService.create(newData);

      const farmer = await this.userService.getUsers({
        phone: data?.farmerPhone,
      });

      const owner = await this.userService.getUser(data?.ownerId);

      if (farmer?.length > 0) {
        if (data?.paymentType.toLowerCase() == 'credit') {
          await oneSignal(
            'message',
            `${owner?.name} has created a transaction.`,
            `${data?.totalAmount} Pending`,
            '',
            farmer[0]?._id,
          );
        } else if (data?.paymentType.toLowerCase() == 'cash') {
          await oneSignal(
            'message',
            `${owner?.name} has created a transaction.`,
            `Payment is successfull`,
            '',
            farmer[0]?._id,
          );
        }
      } else {
        await oneSignal(
          'message',
          'Farmer is not registered.',
          'Please contact them to register',
          '',
          data?.ownerId,
        );
      }

      const obj1: any = {
        ownerId: data?.ownerId,
        farmerProfileID: farmerProfile?._id,
      };

      const totalAmountData: any[] =
        await this.transactionsService.getTotalAmount(obj1);

      let newTotalAmountId: string;

      if (totalAmountData?.length > 0) {
        newTotalAmountId = totalAmountData[0]?._id;
        await this.transactionsService.updateTotalAmount(
          totalAmountData[0]?._id,
          {
            amount:
              Number(totalAmountData[0]?.amount) + Number(data?.totalAmount),
          },
        );
      } else {
        const localObj = {
          ...obj1,
          amount: data?.totalAmount,
        };

        const newTotalAmount = await this.transactionsService.addTotalAmount(
          localObj,
        );

        newTotalAmountId = newTotalAmount?._id;
      }

      newTransaction = await this.transactionsService.update(
        newTransaction?._id,
        { totalAmountId: newTotalAmountId },
      );

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
      const data: any[] = await this.transactionsService.getAllTransactions(
        nextData,
      );

      const paymentObj = {
        ownerId: ownerId,
        farmerProfileID: farmerProfileId,
      };

      const paymentData: any[] =
        await this.transactionsService.getPaymentHistory(paymentObj);

      const returnObj = {
        transactionData: data,
        farmerName: data[0]?.farmerName,
        totalAmountId: data?.filter((s) => s.totalAmountStatus == 'ACTIVE')[0]
          ?.totalAmountId,
        amountDue:
          data
            ?.filter((s) => s.paymentType == 'credit')
            ?.reduce((acc, it) => acc + Number(it.totalAmount), 0) -
          paymentData?.reduce((acc, it) => acc + Number(it.amount), 0),
        amountPaid: paymentData?.reduce(
          (acc, it) => acc + Number(it.amount),
          0,
        ),
      };
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent All Transactions!',
        },
        returnObj,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Post('/addPayment')
  async addPayment(@Res() response, @Body() data: paymentData) {
    const { amount, totalAmountId } = data;

    try {
      const obj = {
        amount: amount,
        totalAmountId: totalAmountId,
      };

      const newPayment = await this.transactionsService.addPayment(obj);

      const payments: any[] = await this.transactionsService.getPayment(
        totalAmountId,
      );

      const totalAmount: any[] = await this.transactionsService.getTotalAmount(
        totalAmountId,
      );

      const amountDue =
        totalAmount[0]?.amount -
        payments?.reduce((acc, it) => acc + Number(it?.amount), 0);

      if (amountDue == 0) {
        await this.transactionsService.updateTotalAmount(totalAmount[0]._id, {
          status: 'INACTIVE',
        });
      }

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Added New Payment!',
        },
        newPayment,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getPaymentHistory')
  async getPaymentHistory(
    @Res() response,
    @Query('ownerId') ownerId: string,
    @Query('farmerProfileID') farmerProfileID: string,
  ) {
    try {
      const obj: any = {
        ownerId,
        farmerProfileID,
      };
      const data = await this.transactionsService.getPaymentHistory(obj);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Payment History!',
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

  @Get('/dashboard')
  async getdashboardData(@Res() response, @Query('ownerId') ownerId: string) {
    try {
      const data = await this.transactionsService.getDashboardData(ownerId);

      console.log(data);
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

  @Post('/sendNotificationToFarmer')
  async sendNotification(
    @Res() response,
    @Query('farmerProfileID') farmerProfileID: string,
    @Query('ownerId') ownerId: string,
    @Query('userName') userName: string,
    @Query('dueAmount') dueAmount: number,
  ) {
    try {
      // await oneSignal(
      //   'message',
      //   `Reminder to pay - ₹${dueAmount} to ${userName}`,
      //   `₹${dueAmount} is Pending`,
      //   '',
      //   farmerProfileID,
      // );

      const obj = {
        ownerId,
        farmerProfileId: farmerProfileID,
      };

      const reminderData = await this.transactionsService
        .addOwnerReminder(obj)
        .catch((err) => {
          console.log(err);
        });

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Notification to Farmer!',
        },
        '',
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getTripCount')
  async getTripCount(
    @Res() response,
    @Query('ownerId') ownerId: string,
    @Query('phoneNumber') phoneNumber: number,
  ) {
    try {
      const data = await this.transactionsService.getTripCount(
        ownerId,
        phoneNumber,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Sent Trip Count Data!',
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

  @Post('/addDiary')
  async addDiary(@Res() response, @Body() data: any) {
    try {
      const obj = {
        ...data,
        isActive: true,
        createdAt: new Date(),
      };

      const newDiary = await this.transactionsService.addDiary(obj);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Added New Diary Entry!',
        },
        newDiary,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getDetailedDairyEntries')
  async getDiary(
    @Res() response,
    @Query('ownerId') ownerId: string,
    @Query('date') date: Date,
  ) {
    try {
      const diaryEntries = await this.transactionsService.getDetailedDiaries(
        ownerId,
        date,
      );

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Sent Diary Entries!',
        },
        diaryEntries,
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
