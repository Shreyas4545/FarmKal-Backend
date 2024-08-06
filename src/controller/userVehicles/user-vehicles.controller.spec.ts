import { Test, TestingModule } from '@nestjs/testing';
import { UserVehiclesController } from './user-vehicles.controller';

describe('UserVehiclesController', () => {
  let controller: UserVehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVehiclesController],
    }).compile();

    controller = module.get<UserVehiclesController>(UserVehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
