import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class LocationDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly type: string;
}
