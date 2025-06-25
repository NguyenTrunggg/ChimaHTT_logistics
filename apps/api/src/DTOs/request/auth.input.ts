export class LoginDto {
  username!: string;
  password!: string;
}

export class RegisterDto extends LoginDto {
  email?: string;
}

export class ChangePasswordDto {
  oldPassword!: string;
  newPassword!: string;
} 