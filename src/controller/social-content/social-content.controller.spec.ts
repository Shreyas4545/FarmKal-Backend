import { Test, TestingModule } from '@nestjs/testing';
import { SocialContentController } from './social-content.controller';

describe('SocialContentController', () => {
  let controller: SocialContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialContentController],
    }).compile();

    controller = module.get<SocialContentController>(SocialContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
