import { UserRole } from '@prisma/client';
import { UserAuthResponse, UserResponse } from '@/types';

// Request types
export interface CreateUserRequest {
  email: string;
  name: string;
  password?: string;
  corporationName?: string;
  corporationId?: string;
}

export interface getUserByAttrbRequest {
  accessType: 'email' | 'id';
  id: string;
}

// Service interface
export interface IAuthService {
  createUser(userData: CreateUserRequest): Promise<UserAuthResponse>;
  getUserByAttrb(request: getUserByAttrbRequest): Promise<UserResponse | null>;
}

// DAO interface
export interface IAuthDao {
  findByEmail(email: string): Promise<any | null>;
  findById(id: string): Promise<any | null>;
}

// Re-export UserResponse for convenience
export type { UserResponse };

export class UserDto implements UserResponse {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  public readonly role: UserRole;
  public readonly isVerified: boolean;
  public readonly tokenBalance: number;
  public readonly corporationId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name || '';
    this.role = user.role;
    this.isVerified = user.isVerified || false;
    this.tokenBalance = user.tokenBalance || 0;
    this.corporationId = user.corporationId || '';
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromUser(user: any): UserDto {
    return new UserDto(user);
  }

  toJSON(): UserResponse {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      isVerified: this.isVerified,
      tokenBalance: this.tokenBalance,
      corporationId: this.corporationId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default UserDto;
