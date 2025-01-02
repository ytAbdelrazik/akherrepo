import { IsString } from 'class-validator';


export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  userId: string;

  @IsString() // every note must now have a moduleId
  moduleId: string;

  @IsString()
  content: string;
}  