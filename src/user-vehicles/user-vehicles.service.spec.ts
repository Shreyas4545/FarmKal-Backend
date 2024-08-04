import { Test, TestingModule } from '@nestjs/testing';
import { UserVehiclesService } from './user-vehicles.service';

describe('UserVehiclesService', () => {
  let service: UserVehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVehiclesService],
    }).compile();

    service = module.get<UserVehiclesService>(UserVehiclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
