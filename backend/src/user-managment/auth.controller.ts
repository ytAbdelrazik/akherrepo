import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserdto } from '../user-managment/dots/CreateUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserdto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async login(@Body() body: any, @Req() req: any): Promise<any> {
    const { email, password } = body;
    const ipAddress = req.ip || ''; // Get user's IP address
    const userAgent = req.headers['user-agent'] || ''; // Get user's user-agent string

    try {
      return await this.authService.login(email, password, ipAddress, userAgent);
    } catch (error) {
      throw new UnauthorizedException('Invalid login attempt');
    }
  }
}
