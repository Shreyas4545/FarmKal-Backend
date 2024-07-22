import { IsNotEmpty, IsNumber } from 'class-validator';

export class createLoginDTO {
  @IsNumber()
  @IsNotEmpty()
  readonly phone: number;

  @IsNumber()
  @IsNotEmpty()
  readonly otp: number;
}
