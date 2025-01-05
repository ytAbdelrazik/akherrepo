import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user-managment/user.service';
import { CreateUserdto } from '../user-managment/dots/CreateUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FailedLoginDocument } from './failed-login.schema';
import{blacklistToken} from './token-blacklist';
@Injectable()
export class AuthService {
  private readonly adminPassphrase = 'admin'; // Passphrase for admin
  private readonly instructorPassphrase = 'inst'; // Passphrase for instructor

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel('FailedLogin') private failedLoginModel: Model<FailedLoginDocument>,
  ) {}


  private async logFailedAttempt(
    email: string,
    reason: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<void> {
    await this.failedLoginModel.create({
      email,
      reason,
      ipAddress,
      userAgent,
    });
  }

  
  private generateUserId(role: string): string {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // Random 5-digit number
    switch (role) {
      case 'admin':
        return `AD${randomNumber}`;
      case 'instructor':
        return `IS${randomNumber}`;
      case 'student':
        return `ST${randomNumber}`;
      default:
        throw new BadRequestException('Invalid role');
    }
  }



  async signUp(userDto: CreateUserdto): Promise<any> {
    // Check for role-specific passphrase
  

    // Generate a unique user ID based on the role
    const userId = this.generateUserId(userDto.role);

    // Hash the password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Create the new user
    const newUser = {
      userId,
      name: userDto.name,
      email: userDto.email,
      passwordHash: hashedPassword,
      role: userDto.role,
     
    };

    return this.userService.createUser(newUser); // Save the user in the database
  }


  async validateUser(email: string, password: string, ipAddress: string, userAgent: string): Promise<any> {
    const user = await this.userService.findByEmail(email); // Check if the user exists
    if (!user) {
      await this.logFailedAttempt(email, 'User not found', ipAddress, userAgent);
      return null; // Return null if the user doesn't exist
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // Compare passwords
    if (!isPasswordValid) {
      await this.logFailedAttempt(email, 'Invalid password', ipAddress, userAgent);
      return null; // Return null if the password is invalid
    }
  
    return user; // Return the user if both email and password are correct
  }
  
  


  
  async login(email: string, password: string, ipAddress: string, userAgent: string): Promise<any> {
    const user = await this.validateUser(email, password, ipAddress, userAgent);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      email: user.email, 
      role: user.role, 
      userId: user.userId,// Add userId here
      name: user.name
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken: accessToken,
      role: user.role,
      userId: user.userId,  // Include role here
    };
  }
  async logout(userId: string, token: string): Promise<boolean> {
    // Optionally verify the user's token validity if necessary
  
    // Add token to the blacklist
    blacklistToken(token); // Corrected the typo by using the imported function
  
    return true;
  }

  
}
