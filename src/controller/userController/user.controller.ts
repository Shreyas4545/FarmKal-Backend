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
} from '@nestjs/common';
import { createUserDto } from 'src/dto/userDto/create-user.dto';
import { ResponseCompo } from 'src/utils/response';
import { UserService } from 'src/service/userService/user.service';
import { updateUserDto } from 'src/dto/userDto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseCompo: ResponseCompo,
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
        return this.responseCompo.errorResponse(
          response,
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'You are already Registered, Please login to continue!',
          },
          existingUser,
        );
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
      return this.responseCompo.errorResponse(
        response,
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        err,
      );
    }
  }

  @Get('/get/:id')
  async getUser(@Res() response, @Param('id') userId: string) {
    try {
      const user: any = await this.userService.getUser(userId);

      if (!user) {
        return this.responseCompo.errorResponse(
          response,
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Error! User Not Found',
          },
          '',
        );
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
      return this.responseCompo.errorResponse(
        response,
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        err,
      );
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
      return this.responseCompo.errorResponse(
        response,
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        err,
      );
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
      return this.responseCompo.errorResponse(
        response,
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
        err,
      );
    }
  }
}
