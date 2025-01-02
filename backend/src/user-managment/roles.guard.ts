import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the roles required for the current route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (request.route.path === '/auth/login' ||request.route.path === '/auth/sign-up' ) {
      return true; // Allow login without token
    }
    console.log('Authorization Header:', authorization); // Debugging
    
    if (!authorization) {
      throw new UnauthorizedException('Authorization header missing');
    }
    
    const token = authorization.split(' ')[1];
    console.log('Extracted Token:', token); // Debugging
    

    // Ensure Bearer token format
    // const token = authorization.split(' ')[1];
    // if (!token) {
    //   throw new UnauthorizedException('Bearer token missing');
    // }

    try {
      // Verify the token
      const user = this.jwtService.verify(token, { secret: 'ahmed' }); // Explicitly pass the secret


      // Ensure the payload contains required fields
      if (!user.userId || !user.role) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Attach the user to the request object for later use
      request.user = user;

      // Check if the route requires specific roles
      if (!requiredRoles || requiredRoles.length === 0) {
        return true; // Allow access if no roles are required
      }

      // Allow access if the user's role matches any of the required roles
      return requiredRoles.includes(user.role);
    } catch (error) {
      console.error('Token verification error:', error.message); // Debugging token issues
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
