import { IsBoolean, IsMongoId, IsString } from 'class-validator';

export class createBrandDTO {
  @IsMongoId()
  readonly categoryId: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly image: string;

  @IsBoolean()
  readonly isActive: boolean;
}
