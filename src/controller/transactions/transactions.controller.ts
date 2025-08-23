import {
  Body,
  Controller,
  Delete,
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
        const resultData =
          await this.transactionsService.updateDriverEntryDetails(
            '',
            '',
            '',
            '',
            '',
            status,
            id,
            '',
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

      const obj: any = {
        diaryId: data?.diaryId,
        driverId: existingData?._id,
        status: 'PENDING',
      };

      await this.transactionsService.addTrackingReq(obj);

      await oneSignal(
        'message',
        `${owner?.name} has requested to track your location.`,
        `View it`,
        '',
        data?.driverId,
      );
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

  // ...existing code...
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

      let tripCount = 0;
      let hourCount = 0;

      if (result?.diaryData?.length > 0) {
        const diary = result?.diaryData[0];
        const diaryType = diary?.type;
        const rate = Number(diary?.rate ?? diary?.ratePerUnit ?? 0);

        for (let driver of diary?.drivers || []) {
          let individualDriverCount: any = 0;
          for (let entry of driver?.driverEntries || []) {
            if (diaryType === 'trip') {
              if (entry?.trips != null) {
                const t = Number(entry?.trips);
                tripCount += t;
                individualDriverCount += t;
              }
            } else {
              if (entry?.startTime && entry?.endTime) {
                const count: any = TimeUtils.getTimeDifferenceInMinutes(
                  entry?.startTime,
                  entry?.endTime,
                );

                entry.totalTime = TimeUtils.formatMinutes(count);

                individualDriverCount += count;
                hourCount += count;
              }
            }
          }
          if (diaryType === 'trip') {
            driver.totalTrips = individualDriverCount;
          } else {
            driver.totalHours = TimeUtils.formatMinutes(individualDriverCount);
          }
        }

        const roundedHours = Math.ceil(hourCount / 60);
        const totalAmount =
          diaryType === 'trip' ? tripCount * rate : roundedHours * rate;

        let returnObj: any = {
          ...result?.diaryData[0],
          locationTrackReqPresent: result?.locationTrackReqPresent,
          totalTripCount: tripCount,
          totalHourCount: TimeUtils.formatMinutes(hourCount),
          roundedHourCount: String(roundedHours),
          totalAmount: totalAmount,
        };

        if (result?.locationTrackReqPresent) {
          returnObj.locationTrackDataId = result?.locationTrackDataId;
        }

        return response.status(HttpStatus.OK).json({
          message: 'Diary details fetched successfully',
          data: returnObj,
        });
      } else {
        return response.status(HttpStatus.NOT_FOUND).json({
          message: 'Diary not found',
        });
      }
    } catch (err) {
      console.error(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch diary details',
        error: err.message || err,
      });
    }
  }

  @Post('/addUpdateDriverEntries')
  async addUpdateDriverEntries(
    @Query('id') id: string,
    @Query('driverDiaryId') driverDiaryId: string,
    @Body('hours') hours: any,
    @Body('trips') trips: any,
    @Body('startTime') startTime: string,
    @Body('endTime') endTime: string,
    @Body('status') status: string,
    @Body('diaryType') diaryType: string,
    @Body('tripStatus') tripStatus: string,
    @Res() response,
  ) {
    try {
      let result: any = [];

      if (diaryType == 'trips') {
        if (tripStatus == 'STARTED') {
          let obj: any = {};

          if (driverDiaryId) {
            obj.driverDiaryId = driverDiaryId;
          }
          obj.trips = 1;
          if (status) {
            obj.status = status;
          }
          obj.tripStatus = tripStatus;
          result = await this.transactionsService.addDriverEntryDetails(obj);
        } else {
          result = await this.transactionsService.updateDriverEntryDetails(
            id,
            hours,
            trips,
            startTime,
            endTime,
            status,
            '',
            'ENDED',
          );
        }
      } else {
        if (startTime) {
          let obj: any = {};

          if (driverDiaryId) {
            obj.driverDiaryId = driverDiaryId;
          }

          if (hours !== '' && hours != null) {
            obj.hours = hours;
          }

          if (trips != null && trips !== '') {
            obj.trips = trips;
          }
          if (startTime) {
            obj.startTime = startTime;
          }
          if (endTime) {
            obj.endTime = endTime;
          }
          if (status) {
            obj.status = status;
          }
          result = await this.transactionsService.addDriverEntryDetails(obj);
        } else {
          result = await this.transactionsService.updateDriverEntryDetails(
            id,
            hours,
            trips,
            startTime,
            endTime,
            status,
            '',
            '',
          );
        }
      }
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

  @Get('/getDriverLocations')
  async getDriverLocations(
    @Query('driverId') driverId: string,
    @Query('diaryId') diaryId: string,
    @Res() response,
  ) {
    try {
      const data = await this.transactionsService.getDriverLocationEntries(
        diaryId,
        driverId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Driver Location Entries sent successfully',
        data: data,
      });
    } catch (err) {
      console.log(err);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to send driver location entries',
        error: err.message || err,
      });
    }
  }

  @Post('/deleteDriverEntries')
  async deleteDriverEntries(@Res() response, @Query('id') id: string) {
    try {
      console.log(id);
      const deletedDriverEntry =
        await this.transactionsService.deleteDriverEntry(id);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Deleted Driver Entry',
        },
        deletedDriverEntry,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Post('/deleteDriverDetails')
  async deleteDriverDetails(@Res() response, @Query('id') id: string) {
    try {
      console.log(id);
      const deletedDriverEntry =
        await this.transactionsService.deleteDriverDetails(id);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Deleted Driver Details',
        },
        deletedDriverEntry,
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
