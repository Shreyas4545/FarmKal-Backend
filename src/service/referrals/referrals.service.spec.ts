import { Test, TestingModule } from '@nestjs/testing';
import { ReferalsService } from './referrals.service';

describe('ReferalsService', () => {
  let service: ReferalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReferalsService],
    }).compile();

    service = module.get<ReferalsService>(ReferalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
