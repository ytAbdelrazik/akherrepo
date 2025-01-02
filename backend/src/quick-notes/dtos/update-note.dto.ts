import { IsString, IsOptional } from 'class-validator';
//validate datatypoe ONLY IF theres content/update.. optional
export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  content?: string;
}
