import { LikesService } from '../../service/categoryService/likes/likes.service';
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
import { ResponseCompo } from '../../utils/response';
import { ILikes } from '../../interface/likes.interface';

@Controller('api/likes')
export class LikesController {
  constructor(
    private readonly likesService: LikesService,
    private readonly responseCompo: ResponseCompo,
  ) {}

  @Post('/create')
  async createLikes(@Res() response, @Body() data: any) {
    console.log(data);
    try {
      const existingLike = await this.likesService.getLikes(
        data?.postId,
        data?.userId,
      );
      if (existingLike?.length > 0) {
        return this.responseCompo.successResponse(
          response,
          {
            statusCode: HttpStatus.CREATED,
            message: 'Like Already Exists',
          },
          existingLike[0],
        );
      }
      let newLike: any = {
        ...data,
        createdAt: new Date(),
      };
      newLike = await this.likesService.addLike(newLike);

      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.CREATED,
          message: 'Successfully Created Like',
        },
        newLike,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getTotalLikesOfPost')
  async getTotalLikesOfPost(@Res() response, @Query('postId') postId: string) {
    try {
      const totalLikes: number = await this.likesService.getTotalLikesOfPost(
        postId,
      );
      console.log(totalLikes);
      return response.status(200).json({
        success: true,
        message: 'Successfully sent likes of a post',
        data: totalLikes ? totalLikes : 0,
      });
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Get('/getUserLikedPosts')
  async getAllUserLikedPosts(@Res() response, @Query('userId') userId: string) {
    try {
      const likesOfUser: number = await this.likesService.getAllUserLikedPosts(
        userId,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully sent all user liked posts',
        },
        likesOfUser,
      );
    } catch (err) {
      console.log(err);
      return this.responseCompo.errorResponse(response, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Something went wrong + ${err}`,
      });
    }
  }

  @Post('/updateLike')
  async updateLike(
    @Res() response,
    @Query('postId') postId: string,
    @Query('userId') userId: string,
  ) {
    try {
      const updatedLike: ILikes = await this.likesService.updateLike(
        postId,
        userId,
      );
      return this.responseCompo.successResponse(
        response,
        {
          statusCode: HttpStatus.OK,
          message: 'Successfully Deleted like',
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
}
