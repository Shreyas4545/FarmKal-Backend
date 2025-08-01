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
import { TimeUtils } from '../../utils/timeFunctions';
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
    console.log('Here', data);
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
        noOfTrips: data
          ?.filter((s) => s.isTrip == true)
          ?.reduce((acc, it) => acc + it.noOfUnits, 0),
        noOfHours: data
          ?.filter((s) => s.isTrip == false)
          ?.reduce((acc, it) => acc + it.noOfUnits, 0),
        totalAmountId: data?.filter((s) => s.totalAmountStatus == 'ACTIVE')[0]
          ?.totalAmountId,
        amountDue:
          data
            ?.filter(
              (s) => s.paymentType == 'credit' || s.paymentType == 'cash',
            )
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
  async addDiary(@Body() data: any, @Res() response) {
    try {
      const existingData = await this.transactionsService.checkUser(
        data?.phoneNo,
        data?.name,
      );

      const dataToStore: any = {
        ...data,
        customerName: data?.name,
        customerId: existingData?._id,
        createdAt: new Date(),
      };

      const result = await this.transactionsService.addDiary(dataToStore);
      return response.status(HttpStatus.CREATED).json({
        message: 'Diary created successfully',
        data: result,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create diary',
        error: err.message || err,
      });
    }
  }

  @Get('/getDiaries')
  async getDiaries(
    @Query('customerId') customerId: string,
    @Query('type') type: string,
    @Query('driverId') driverId: string,
    @Res() response,
  ) {
    try {
      if (type == 'owner') {
        const result = await this.transactionsService.getDiaries(customerId);
        return response.status(HttpStatus.OK).json({
          message: 'Fetched diaries successfully',
          data: result,
        });
      } else if (type == 'driver') {
        const data = await this.transactionsService.getDriverOnlyEntries(
          driverId,
        );
        return response.status(HttpStatus.OK).json({
          message: 'Driver Only details sent successfully',
          data: data,
        });
      }
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch diaries',
        error: err.message || err,
      });
    }
  }

  @Put('/updateDiary/:id')
  async updateDiaryStatus(
    @Param('id') id: string,
    @Query('status') status: string,
    @Body() data: any,
    @Res() response,
  ) {
    try {
      if (status == 'ACTIVE') {
        const resultData = await this.transactionsService.updateDriverDetails(
          '',
          '',
          '',
          '',
          '',
          status,
          id,
        );
      }

      let updateObj: any = { status, ...data, customerName: data?.name };

      if (data?.name && data?.phoneNo) {
        const existingData = await this.transactionsService.checkUser(
          data?.phoneNo,
          data?.name,
        );

        updateObj = {
          ...updateObj,
          customerName: data?.name,
          customerId: existingData?._id,
        };
      }

      const result = await this.transactionsService.updateDiaryStatus(
        id,
        updateObj,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Diary status updated successfully',
        data: result,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update diary status',
        error: err.message || err,
      });
    }
  }

  @Post('/addDriver')
  async createDriver(@Body() data: any, @Res() response) {
    try {
      const existingData = await this.transactionsService.checkUser(
        data?.phoneNo,
        data?.name,
      );

      const dataToStore: any = {
        ...data,
        driverName: data?.name,
        driverId: existingData?._id,
        createdAt: new Date(),
      };

      const owner: any = this.userService.getUser(data?.ownerId);

      await oneSignal(
        'message',
        `${owner?.name} has created a transaction.`,
        `View it`,
        '',
        owner._id,
      );

      const result = await this.transactionsService.createDriver(dataToStore);
      return response.status(HttpStatus.CREATED).json({
        message: 'Driver created successfully',
        data: result,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create driver',
        error: err.message || err,
      });
    }
  }

  @Get('/getDiaryDetails')
  async getDiaryDetails(
    @Query('diaryId') diaryId: string,
    @Query('driverId') driverId: string,
    @Res() response,
  ) {
    try {
      const result: any = await this.transactionsService.getDriverEntryDetails(
        diaryId,
        driverId,
      );

      console.log(result);
      let tripCount = 0;
      let hourCount = 0;
      if (result?.length > 0) {
        for (let i of result[0]?.drivers) {
          if (result[0]?.type == 'trip') {
            tripCount += Number(i?.trips);
          } else if (i?.startTime && i?.endTime) {
            const count: any = TimeUtils.getTimeDifferenceInMinutes(
              i?.startTime,
              i?.endTime,
            );

            i.totalTime = TimeUtils.formatMinutes(count);
            hourCount += count;
          }
        }
      }

      let returnObj: any = {
        ...result?.diaryData[0],
        locationTrackReqPresent: result?.locationTrackReqPresent,
        tripCount: tripCount,
        hourCount: TimeUtils.formatMinutes(hourCount),
      };

      if (result?.locationTrackReqPresent) {
        returnObj.locationTrackDataId = result?.locationTrackDataId;
      }

      return response.status(HttpStatus.OK).json({
        message: 'Diary details fetched successfully',
        data: returnObj,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch diary details',
        error: err.message || err,
      });
    }
  }

  @Put('/updateDriverEntries/:id')
  async updateDriverDetails(
    @Param('id') id: string,
    @Body('hours') hours: number,
    @Body('trips') trips: number,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
    @Body('status') status: string,
    @Res() response,
  ) {
    try {
      const result = await this.transactionsService.updateDriverDetails(
        id,
        hours,
        trips,
        startTime,
        endTime,
        status,
        '',
      );
      return response.status(HttpStatus.OK).json({
        message: 'Driver details updated successfully',
        data: result,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update driver details',
        error: err.message || err,
      });
    }
  }

  @Get('/getDriverOnlyEntries')
  async getDriverOnlyEntries(
    @Query('driverId') driverId: string,
    @Res() response,
  ) {
    try {
      const data = await this.transactionsService.getDriverOnlyEntries(
        driverId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Driver Only details sent successfully',
        data: data,
      });
    } catch (err) {
      console.log(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update driver details',
        error: err.message || err,
      });
    }
  }

  @Post('/addTrackingRequest')
  async addTrackingRequest(@Body() data: any, @Res() response) {
    try {
      const result = await this.transactionsService.addTrackingReq(data);

      await oneSignal(
        'message',
        `${data?.ownerName} has requested to track your location.`,
        `View it`,
        '',
        data?.driverId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Tracking Request Added Successfully',
        data: result,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create driver',
        error: err.message || err,
      });
    }
  }

  @Put('/updateTrackingRequest/:id')
  async updateTrackingRequest(
    @Body() data: any,
    @Param('id') id: string,
    @Res() response,
  ) {
    try {
      const result = await this.transactionsService.updateTrackingRequest(
        id,
        data,
      );

      await oneSignal(
        'message',
        `${data?.ownerName} has requested to track your location.`,
        `View it`,
        '',
        data?.driverId,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Tracking Request Added Successfully',
        data: result,
      });
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create driver',
        error: err.message || err,
      });
    }
  }
}
