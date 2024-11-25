import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class createTransactionDTO {
  @IsString()
  @IsNotEmpty()
  readonly ownerId: string;

  @IsString()
  @IsOptional()
  readonly farmerProfileID: string;

  @IsString()
  @IsOptional()
  readonly locationId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNo: number;

  // @IsNumber()
  // @IsNotEmpty()
  // readonly noOfUnits: number;

  // @IsNumber()
  // @IsOptional()
  // readonly totalAmount: number;

  // @IsNumber()
  // @IsOptional()
  // readonly farmerPhone: number;

  @IsString()
  @IsNotEmpty()
  readonly paymentType: string;

  @IsString()
  @IsNotEmpty()
  readonly price: number;

  @IsString()
  @IsOptional()
  readonly crop: string;

  @IsString()
  @IsOptional()
  readonly unit: string;

  @IsString()
  @IsNotEmpty()
  readonly rentalCategoryId: string;
}
