import { Test, TestingModule } from '@nestjs/testing';
import { RentalCategoryService } from './rental-category.service';

describe('RentalCategoryService', () => {
  let service: RentalCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RentalCategoryService],
    }).compile();

    service = module.get<RentalCategoryService>(RentalCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
