import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly email: string;

  @IsString()
  @IsOptional()
  readonly image: string;

  @IsNumber()
  @IsNotEmpty()
  readonly phone: number;

  @IsString()
  @IsOptional()
  readonly state: string;

  @IsString()
  @IsOptional()
  readonly city: string;

  @IsString()
  @IsOptional()
  readonly country: string;
}
