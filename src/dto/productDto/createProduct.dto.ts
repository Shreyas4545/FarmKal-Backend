import {
  IsArray,
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

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly manufacturingYear: number;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsArray()
  @IsOptional()
  readonly additionalFields?: Record<string, any[]> | any[];
}
