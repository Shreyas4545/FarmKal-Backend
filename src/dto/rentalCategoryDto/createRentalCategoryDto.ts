import { IsBoolean, IsString } from 'class-validator';

export class createRentalCategoryDTO {
  @IsString()
  readonly name: string;

  @IsBoolean()
  readonly isActive: boolean;
}
