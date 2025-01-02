import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateInstructorDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string; // Email is optional

  @IsOptional()
  @IsString()
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
  password?: string; // If provided, validate the password length
}
