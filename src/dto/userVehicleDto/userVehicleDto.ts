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

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly manufacturingYear: number;

  @IsObject()
  @IsOptional()
  readonly additionalFields?: Record<string, any>;
}
