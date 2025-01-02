import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from './course.schema';

describe('CourseService', () => {
  let service: CourseService;
  let model: Model<Course>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getModelToken(Course.name),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    model = module.get<Model<Course>>(getModelToken(Course.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
