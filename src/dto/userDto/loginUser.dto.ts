import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class createLoginDTO {
  @IsNumber()
  @IsNotEmpty()
  readonly phone: number;

  @IsNumber()
  // @IsNotEmpty()
  @IsOptional()
  readonly otp: number;
}
