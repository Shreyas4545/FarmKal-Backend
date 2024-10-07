import { Test, TestingModule } from '@nestjs/testing';
import { userVehicleService } from './user-vehicles.service';

describe('UserVehiclesService', () => {
  let service: userVehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [userVehicleService],
    }).compile();

    service = module.get<userVehicleService>(userVehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
