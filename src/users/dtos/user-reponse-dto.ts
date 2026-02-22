import { IsEmail, IsString } from "class-validator";

// users/dto/user-response.dto.ts
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  address?: string;
}