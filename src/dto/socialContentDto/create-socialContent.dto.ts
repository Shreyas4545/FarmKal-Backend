import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class createSocialContentDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsMongoId()
  @IsOptional()
  readonly authorId: string;

  @IsString()
  @IsOptional()
  readonly image: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly publishedAt: Date;
}
