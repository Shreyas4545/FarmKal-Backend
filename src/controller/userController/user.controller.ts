import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { createUserDto } from 'src/dto/userDto/create-user.dto';
import { ResponseCompo } from 'src/utils/response';
import { UserService } from 'src/service/userService/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Post('/create')
  async createUser(@Res() response, @Body() createUserDto: createUserDto) {
    try {
      const newUser = await this.userService.createUser(createUserDto);

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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: true,
        message: 'Successfully Created User',
      });
    }
  }

  @Get('/get/:id')
  async getUser(@Res() response, @Param('id') userId: string) {
    try {
      const user = await this.userService.getUser(userId);

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
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong',
      });
    }
  }
}
