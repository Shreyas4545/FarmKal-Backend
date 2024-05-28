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
}
