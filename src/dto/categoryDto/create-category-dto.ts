import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CategoryDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;
}
