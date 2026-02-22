import { Inject, Injectable } from '@nestjs/common';
import { string } from 'zod';
import { USERS_DATA } from './users.constants';
import { UpdateUserDto } from './dtos/update-user-dto';
import { CreateUserDto } from './dtos/create-user-dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entiites/users.entity';
import { UserResponseDto } from './dtos/user-reponse-dto';

// This should be a real class/interface representing a user entity
// export type User = any;
@Injectable()
export class UsersService {
    constructor(
        @Inject(USERS_DATA) private readonly users: User[],
        // @Inject('EXTERNAL_USER_DATA_SERVICE') private readonly externalUserDataService: any
    ) {}

    private toUserResponse(user: User): UserResponseDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
    };
    }

    createUser(user: CreateUserDto): User {
        const newUser = {
            ...user,
            id: this.users.length + 1
        };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(user: UpdateUserDto & { id: number }): User {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index === -1) {
            throw new Error('User not found');
        }

        this.users[index] = {
            name: user.name ?? this.users[index].name,
            email: user.email ?? this.users[index].email,
            password: user.password ?? this.users[index].password,
            address: user.address ?? this.users[index].address,
            role: this.users[index].role,
            id: this.users[index].id,
            updatedAt: new Date()
        };

        return this.users[index];
    }
    
    findByEmail(email: string)  {
        return this.users.find(u => u.email == email)
    }

    async findAll(): Promise<UserResponseDto[]> {
        // const externalUsers = await this.externalUserDataService.fetchUsers();
        // return plainToInstance(User, this.users);
        return this.users.map( user => this.toUserResponse(user))
        // return this.users.map(u => {
        //     const { password, ...userWithoutPassword } = u;
        //     return userWithoutPassword;
        // });
    }

    // implement findAll v2 with pagination
    async findAllV2(page: number = 1, limit: number = 5): Promise<{data: User[], meta: any}> {
        // const externalUsers = await this.externalUserDataService.fetchUsers();
        const allUsers = plainToInstance(User,this.users); // [...this.users, ...externalUsers];
        const startIndex = (page - 1) * limit;
        const endIndex =  page * limit;
        return {
            data: allUsers.slice(startIndex, endIndex),
            meta: {
                page,
                limit,
                total: allUsers.length
            }
        }
    }
}
