import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtGenerate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async generateToken(payload: any): Promise<string> {
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '60m',
    });
    return access_token;
  }

  async verifyToken(token: string): Promise<boolean | any> {
    try {
      const secretKey = process.env.JWT_SECRET;
      await this.jwtService.verify(token, { secret: secretKey });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
