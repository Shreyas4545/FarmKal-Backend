import { Test, TestingModule } from '@nestjs/testing';
import { ProductListingImagesService } from './product-listing-images.service';

describe('ProductListingImagesService', () => {
  let service: ProductListingImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductListingImagesService],
    }).compile();

    service = module.get<ProductListingImagesService>(ProductListingImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
