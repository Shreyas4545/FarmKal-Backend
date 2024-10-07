import { Test, TestingModule } from '@nestjs/testing';
import { RentalCategoryController } from './rental-category.controller';

describe('RentalCategoryController', () => {
  let controller: RentalCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalCategoryController],
    }).compile();

    controller = module.get<RentalCategoryController>(RentalCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
