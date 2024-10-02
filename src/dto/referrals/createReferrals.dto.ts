import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class createReferralDTO {
  @IsMongoId()
  readonly referralOwnerId: string;

  @IsMongoId()
  readonly userId: string;

  @IsString()
  readonly status: string;

  @IsString()
  readonly price: number;

  @IsString()
  readonly createdAt: Date;
}
