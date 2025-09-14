import { Test, TestingModule } from '@nestjs/testing';
import { userVehiclesController } from './user-vehicles.controller';

describe('UserVehiclesController', () => {
  let controller: userVehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [userVehiclesController],
    }).compile();

    controller = module.get<userVehiclesController>(userVehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
