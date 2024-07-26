import { IsMongoId } from 'class-validator';

export class LikesDto {
  @IsMongoId()
  readonly userId: string;

  @IsMongoId()
  readonly postId: string;
}
