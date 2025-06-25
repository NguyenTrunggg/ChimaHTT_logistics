export class UserResponseDto {
  id!: number;
  username!: string;
  email?: string;
  avatar?: string;
  role!: {
    id: number;
    name: string;
  };
}

export class AuthResponseDto {
  user!: UserResponseDto;
  accessToken!: string;
} 