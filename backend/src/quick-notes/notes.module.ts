import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuickNotesService } from './notes.service';
import { QuickNotesController } from './notes.controller';
import { NoteSchema } from './notes.schema';
import { Module as CourseModuleSchema, ModuleSchema } from '../course-management/module.schema'; 


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Note', schema: NoteSchema },
      { name: 'Module', schema: ModuleSchema }, //  Module schema
    ]),
  ],
  controllers: [QuickNotesController],
  providers: [QuickNotesService],
  exports: [],
})
export class QuickNotesModule {}
 