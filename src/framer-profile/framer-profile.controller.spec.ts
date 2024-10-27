import { Test, TestingModule } from '@nestjs/testing';
import { FramerProfileController } from './framer-profile.controller';

describe('FramerProfileController', () => {
  let controller: FramerProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FramerProfileController],
    }).compile();

    controller = module.get<FramerProfileController>(FramerProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
