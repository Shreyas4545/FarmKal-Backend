import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class createMessageDto {
  @IsMongoId()
  @IsOptional()
  readonly conversationId: string;

  @IsMongoId()
  @IsOptional()
  readonly adminOnly: string;

  @IsMongoId()
  readonly senderId: string;

  @IsString()
  readonly message: string;
}
