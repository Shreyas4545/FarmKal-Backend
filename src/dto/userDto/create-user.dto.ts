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

  @IsNumber()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  readonly state: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly isAdmin: boolean;

  @IsBoolean()
  @IsNotEmpty()
  readonly isVisible: boolean;

  @IsBoolean()
  @IsNotEmpty()
  readonly isActive: boolean;
}
