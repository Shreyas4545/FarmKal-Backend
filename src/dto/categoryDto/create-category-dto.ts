import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CategoryDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly image: string;

  @IsBoolean()
  readonly isActive: boolean;
}
