import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { ModuleSchema } from './module.schema';
import { CourseSchema } from '../course-management/course.schema';
import { InstructorSchema } from './instructor.schema';
import { RolesGuard } from '../user-managment/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { StudentSchema } from './student.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Module', schema: ModuleSchema },
      { name: 'Course', schema: CourseSchema },
      { name: 'Instructor', schema: InstructorSchema }, // Ensure this is included
      { name: 'Student', schema: StudentSchema },
    ]),
    JwtModule.register({
      secret: 'ahmed', // Replace with your secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ModuleController],
  providers: [ModuleService, RolesGuard],
  exports: [MongooseModule,ModuleService], // Export service if needed elsewhere
})
export class ModuleModule {}
