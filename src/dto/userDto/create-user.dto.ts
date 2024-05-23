import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsNumber()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly isAdmin: boolean;

  @IsString()
  @IsNotEmpty()
  readonly isVisible: boolean;

  @IsString()
  @IsNotEmpty()
  readonly isActive: boolean;
}
