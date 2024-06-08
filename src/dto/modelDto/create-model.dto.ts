import { IsBoolean, IsMongoId, IsString } from 'class-validator';

export class createModelDTO {
  @IsMongoId()
  readonly categoryId: string;

  @IsMongoId()
  readonly brandId: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;
}
