import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class createProductDTO {
  @IsMongoId()
  readonly categoryId: string;

  @IsMongoId()
  readonly brandId: string;

  @IsOptional()
  @IsMongoId()
  readonly locationId: string;

  @IsMongoId()
  readonly modelId: string;

  @IsMongoId()
  readonly userId: string;

  @IsMongoId()
  readonly: string;

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
