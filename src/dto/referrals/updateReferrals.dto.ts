import { PartialType } from '@nestjs/mapped-types';
import { createReferralDTO } from './createReferrals.dto';

export class updateReferralsDto extends PartialType(createReferralDTO) {}
