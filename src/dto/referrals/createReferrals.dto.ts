import { IsOptional, IsString } from 'class-validator';

export class createReferralDTO {
  @IsString()
  @IsOptional()
  readonly referalId: string;

  @IsString()
  @IsOptional()
  readonly personCount: number;
}
