import { Test, TestingModule } from '@nestjs/testing';
import { InteractiveModulesController } from './quizzes.controller';

describe('InteractiveModulesController', () => {
  let controller: InteractiveModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractiveModulesController],
    }).compile();

    controller = module.get<InteractiveModulesController>(
      InteractiveModulesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
