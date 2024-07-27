import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class createLoginDTO {
  @IsNumber()
  @IsNotEmpty()
  readonly phone: any;

  @IsNumber()
  // @IsNotEmpty()
  @IsOptional()
  readonly otp: number;
}
