import { UserResponseDto } from "../dtos/user-reponse-dto";
import { User } from "../entiites/users.entity";

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address
    };
  }
}