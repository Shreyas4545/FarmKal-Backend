import { PartialType } from '@nestjs/mapped-types';
import { AdsDTO } from './createAds.dto';

export class updateAdsDto extends PartialType(AdsDTO) {}
