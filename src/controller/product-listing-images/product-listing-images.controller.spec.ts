import { Test, TestingModule } from '@nestjs/testing';
import { ProductListingImagesController } from './product-listing-images.controller';

describe('ProductListingImagesController', () => {
  let controller: ProductListingImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductListingImagesController],
    }).compile();

    controller = module.get<ProductListingImagesController>(ProductListingImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
