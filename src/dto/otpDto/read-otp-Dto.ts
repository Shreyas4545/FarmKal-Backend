import { IsNumber } from 'class-validator';

export class ReadOtpDTO {
  @IsNumber()
  readonly phone: number;

  @IsNumber()
  readonly otp: number;
}
