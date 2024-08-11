import { Test, TestingModule } from '@nestjs/testing';
import { ReferalsController } from './referrals.controller';

describe('ReferalsController', () => {
  let controller: ReferalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReferalsController],
    }).compile();

    controller = module.get<ReferalsController>(ReferalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
