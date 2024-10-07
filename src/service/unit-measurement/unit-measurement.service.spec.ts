import { Test, TestingModule } from '@nestjs/testing';
import { UnitMeasurementService } from './unit-measurement.service';

describe('UnitMeasurementService', () => {
  let service: UnitMeasurementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitMeasurementService],
    }).compile();

    service = module.get<UnitMeasurementService>(UnitMeasurementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
