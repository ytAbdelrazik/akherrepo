import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { QuickNotesService } from './notes.service';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import{RolesGuard} from 'src/user-managment/roles.guard';
import { UseGuards } from '@nestjs/common';
@Controller('notes')
@UseGuards(RolesGuard)
export class QuickNotesController {
  constructor(private readonly quickNotesService: QuickNotesService) {}

@Post()
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.quickNotesService.create(createNoteDto);
  }
  

@Get('module/:moduleId')
  findByModule(@Param('moduleId') moduleId: string) {
    return this.quickNotesService.findByModule(moduleId);
  }


@Patch(':Title') 
  update(@Param('Title') title: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.quickNotesService.update(title, updateNoteDto);
  }

@Patch('autosave/:title') // Endpoint for autosave bas i think this has to be done/completed fl frontend ?
  async autosave(
    @Param('title') title: string,
    @Body() updateNoteDto: UpdateNoteDto
  ) { 
    return this.quickNotesService.update(title, updateNoteDto);
  }
  
  
@Delete(':Title')
  delete(@Param('Title') title: string) {
    return this.quickNotesService.delete(title);
  }
}