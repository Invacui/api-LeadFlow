import globalConstants from '@/constants/Global.constants';
import { UserAuthResponse } from '@/types';
import { Phone, Role, User } from '@prisma/client';

// User related types
export interface CreateUserRequest {
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;
  phone: Phone;
  provider?: string;
  providerId?: string;
  password?: string;
}

/**
 * @interface UserAuthResponse
 *
 * @description Response returned after user authentication, including user details and JWT token
 */
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
  isVerified: boolean;
  phone: Phone;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

// Request types
export interface getUserByAttrbRequest {
  accessType: 'email' | 'id' | 'phone';
  id: string;
}

// Service types
export interface IAuthService {
  createUser(userData: CreateUserRequest): Promise<UserAuthResponse>;
  getUserByAttrb(request: getUserByAttrbRequest): Promise<UserResponse | null>;
  getAllUsers(): Promise<UserDto[]>;
  updateUser(
    userId: string,
    userData: Partial<CreateUserRequest>
  ): Promise<UserDto | null>;
  deleteUser(userId: string): Promise<boolean>;
}

// DAO types
export interface IAuthDao {
  createUser(userData: CreateUserRequest): Promise<User>;
  getUserByAttrb(request: getUserByAttrbRequest): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(
    userId: string,
    userData: Partial<CreateUserRequest>
  ): Promise<User | null>;
  deleteUser(userId: string): Promise<User | null>;
}

export class UserDto implements UserResponse {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  public readonly role: Role;
  public readonly isVerified: boolean = false;
  public readonly phone: Phone = { countryCode: '', number: '' };
  public readonly credits: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name || '';
    this.role = user.role;
    this.phone = user.phone || { countryCode: '', number: '' };
    this.isVerified = user.isVerified || false;
    this.credits = user.credits || globalConstants.DEFAULT_USER_CREDITS;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  // Static method to create UserDto from User
  static fromUser(user: User): UserDto {
    return new UserDto(user);
  }

  // Method to convert to plain object
  toJSON(): UserResponse {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      isVerified: this.isVerified,
      phone: this.phone,
      role: this.role,
      credits: this.credits,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default UserDto;
