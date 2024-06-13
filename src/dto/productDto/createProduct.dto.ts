import { IsBoolean, IsMongoId, IsNumber, IsString } from 'class-validator';

export class createProductDTO {
  @IsMongoId()
  readonly categoryId: string;

  @IsMongoId()
  readonly brandId: string;

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
}
