import { IsNumber, IsString } from 'class-validator';

export class LocationDTO {
  @IsString()
  readonly city: string;

  @IsString()
  readonly state: string;

  @IsString()
  readonly country: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly type: string;
}
