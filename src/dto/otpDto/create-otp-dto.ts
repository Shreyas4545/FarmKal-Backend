import { IsNumber } from 'class-validator';

export class OtpDTO {
  @IsNumber()
  readonly phone: number;
}
