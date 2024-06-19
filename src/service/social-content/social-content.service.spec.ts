import { Test, TestingModule } from '@nestjs/testing';
import { SocialContentService } from './social-content.service';

describe('SocialContentService', () => {
  let service: SocialContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialContentService],
    }).compile();

    service = module.get<SocialContentService>(SocialContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
