import { SetMetadata } from '@nestjs/common';

// Define a constant key for roles metadata
export const ROLES_KEY = 'roles';

// Create a decorator to set roles metadata
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
