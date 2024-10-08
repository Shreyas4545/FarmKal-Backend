import { Test, TestingModule } from '@nestjs/testing';
import { referralsController } from './referrals.controller';

describe('ReferalsController', () => {
  let controller: referralsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [referralsController],
    }).compile();

    controller = module.get<referralsController>(referralsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
