import { Test, TestingModule } from '@nestjs/testing';
import { UnitMeasurementController } from './unit-measurement.controller';

describe('UnitMeasurementController', () => {
  let controller: UnitMeasurementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitMeasurementController],
    }).compile();

    controller = module.get<UnitMeasurementController>(UnitMeasurementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
