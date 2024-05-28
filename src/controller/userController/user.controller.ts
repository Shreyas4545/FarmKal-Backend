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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createUserDto } from 'src/dto/userDto/create-user.dto';
import { ResponseCompo } from 'src/utils/response';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/service/userService/user.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { updateUserDto } from 'src/dto/userDto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseCompo: ResponseCompo,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/create')
  async createUser(@Res() response, @Body() createUserDto: createUserDto) {
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

      const newUser: any = await this.userService.createUser(createUserDto);

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
          statusCode: HttpStatus.FOUND,
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
  async updateUsers(
    @Res() response,
    @Param('id') userId: string,
    @Body() updateUserDto: updateUserDto,
  ) {
    try {
      const updatedUser: any = await this.userService.updateUsers(
        userId,
        updateUserDto,
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
  async login(@Res() response, @Body() data: any) {
    try {
      if (!data.phone) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.NOT_ACCEPTABLE,
          message: 'Phone and Password are mandatory',
        });
      }

      const user: any = await this.userService.getUsers(data);

      if (!user) {
        return this.responseCompo.errorResponse(response, {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No user found with given phone number',
        });
      }

      // user = { ...user[0]?._doc, otp: data?.otp };
      // const access_token = await this.userService.login(user);

      // if (!access_token) {
      //   return this.responseCompo.errorResponse(response, {
      //     statusCode: HttpStatus.UNAUTHORIZED,
      //     message: 'Incorrect Otp! Please Try Again',
      //   });
      // }

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'User Logged In Successfully',
        },
        // { accesstoken: access_token, ...user },
        user[0],
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
