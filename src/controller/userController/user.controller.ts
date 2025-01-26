import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseCompo } from '../../utils/response';
import { UserService } from '../../service/userService/user.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from '../../utils/imageUpload';
import { createLoginDTO } from '../../dto/userDto/loginUser.dto';
import { ReferralsService } from '../../service/referrals/referrals.service';
import { IReferrals } from '../../interface/referrals.interface';
import { IUser } from '../../interface/user.interface';
// import { ChatGateway } from 'src/utils/chat.gateway';
@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
    private readonly responseCompo: ResponseCompo,
    private readonly referralService: ReferralsService,
  ) {}

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  async createUser(
    @Res() response,
    @Body() createUserDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const existingUser: any = await this.userService
        .getUsers({ phone: createUserDto.phone })
        .catch((err) => {
          console.log(err);
        });

      if (existingUser.length > 0) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.CONFLICT,
          message: 'You are already Registered, Please login to continue!',
        });
      }

      let fileUrl = '';
      if (file) {
        fileUrl = await this.firebaseService.uploadFile(file);
      }

      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let referralId = '';

      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referralId += characters[randomIndex];
      }

      let newUser: any = {
        ...createUserDto,
        image: fileUrl,
        createdAt: new Date(),
        referralId: referralId,
      };

      newUser = await this.userService.createUser(newUser);

      if (createUserDto?.referralId) {
        const referralOwner: IUser = await this.userService.getUsers({
          referralId: createUserDto?.referralId,
        });

        const referralAmount = await this.referralService.getReferralAmount();
        const referralObj: any = {
          referralOwnerId: referralOwner[0]?._id,
          userId: newUser?._id,
          price: referralAmount[0]?.price,
          status: 'ACTIVE',
        };

        await this.referralService.create(referralObj);
      }

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created User',
        },
        newUser,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/get/:id')
  async getUser(@Res() response, @Param('id') userId: string) {
    try {
      const user: any = await this.userService.getUser(userId);

      if (!user) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Error! User Not Found',
        });
      }

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Found User',
        },
        user,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getUsers')
  async getUsers(@Res() response, @Query() data: any) {
    try {
      const users: any = await this.userService.getUsers(data);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Found Users',
        },
        users,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/updateUser/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateUsers(
    @Res() response,
    @Param('id') userId: string,
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      let updatedData = { ...data };
      if (file) {
        updatedData = {
          ...updatedData,
          image: await this.firebaseService.uploadFile(file),
        };
      }
      const updatedUser: any = await this.userService.updateUsers(
        userId,
        updatedData,
      );

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Update User',
        },
        updatedUser,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Put('/addImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @Res() response,
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const updatedData: any = {
        image: await this.firebaseService.uploadFile(file),
      };

      const updatedUser: any = await this.userService.addImage(
        userId,
        updatedData,
      );

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Update User',
        },
        updatedUser,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Post('/login')
  async login(@Res() response, @Body() data: createLoginDTO) {
    try {
      if (!data.phone) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: 'Phone and Password are mandatory',
        });
      }

      let user: any = await this.userService.getUsers(data);

      if (!user) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No user found with given phone number',
        });
      }

      user = { ...user[0]?._doc, otp: data?.otp };
      const access_token: string | boolean = await this.userService.login(user);

      if (!access_token) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Incorrect Otp! Please Try Again',
        });
      }

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'User Logged In Successfully',
        },
        { accesstoken: access_token, ...user },
        // user[0],
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Post('/uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Res() response, @UploadedFile() file: Express.Multer.File) {
    try {
      const fileUrl: string = await this.firebaseService.uploadFile(file);
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Image URL Sent Successfully',
        },
        fileUrl,
      );
    } catch (err) {
      console.log(err);
    }
  }

  // @Get('/getChat')
  // async handleChat(@Res() response, @Body() data: any) {
  //   this.chatService.handleMessage(data, 'A');
  // }

  @Get('/getUserData')
  async getUserData(
    @Res() response,
    @Query('userId') userId: string,
    data: any,
  ) {
    try {
      if (!data.phone) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: 'Phone and Password are mandatory',
        });
      }

      let user: any = await this.userService.getUsers(data);

      if (!user) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No user found with given phone number',
        });
      }

      user = { ...user[0]?._doc, otp: data?.otp };
      const access_token: string | boolean = await this.userService.login(user);

      if (!access_token) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Incorrect Otp! Please Try Again',
        });
      }

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'User Logged In Successfully',
        },
        { accesstoken: access_token, ...user },
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getUserProfileData')
  async getUserProfileData(@Res() response, @Query('userId') userId: string) {
    try {
      if (!userId) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Provide User Id To Fetch Details`,
        });
      }
      const userProfileDetails = await this.userService.getUserProfileData(
        userId,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'User Data Sent Successfully',
        },
        userProfileDetails,
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
