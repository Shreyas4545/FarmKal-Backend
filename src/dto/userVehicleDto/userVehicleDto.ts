import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class createUserVehicleDTO {
  @IsMongoId()
  readonly userId: string;

  @IsOptional()
  @IsString()
  readonly city: string;

  @IsOptional()
  @IsString()
  readonly state: string;

  @IsOptional()
  @IsString()
  readonly country: string;

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly manufacturingYear: number;

  @IsObject()
  @IsOptional()
  readonly additionalFields?: Record<string, any>;
}
