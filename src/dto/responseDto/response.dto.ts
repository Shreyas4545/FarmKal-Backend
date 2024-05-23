import { IsNumber, IsString } from 'class-validator';

export class ResponseDto {
  @IsString()
  readonly message: string;

  @IsNumber()
  readonly statusCode: number;
}
