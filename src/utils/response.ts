import { ResponseDto } from 'src/dto/responseDto/response.dto';
import { Injectable, Res } from '@nestjs/common';

@Injectable()
export class ResponseCompo {
  successResponse(@Res() res, responseDto: ResponseDto, data: any) {
    return res.status(responseDto.statusCode).json({
      success: true,
      message: responseDto.message,
      data: data || '',
    });
  }

  errorResponse(@Res() res, responseDto: ResponseDto, error: any) {
    return res.status(responseDto.statusCode).json({
      success: false,
      message: responseDto.message,
      error: error || '',
    });
  }
}
