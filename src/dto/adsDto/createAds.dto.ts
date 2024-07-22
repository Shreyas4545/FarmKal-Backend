import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AdsDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly businessNumber: number;
}
