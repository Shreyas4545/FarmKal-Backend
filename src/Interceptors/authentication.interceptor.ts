import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtGenerate } from '../utils/jwt.token';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtGenerate) {}
  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: `Invalid Request! Token is expired or it is missing !`,
      });
    }

    const checkToken = await this.jwtService.verifyToken(token).catch((err) => {
      console.log(err);
    });

    if (!checkToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: `Invalid Request! Token is expired or it is missing !`,
      });
    }
    return handler.handle();
  }
}
