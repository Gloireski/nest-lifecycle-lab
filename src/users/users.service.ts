import { Inject, Injectable } from '@nestjs/common';
import { string } from 'zod';
import { USERS_DATA } from './users.constants';
import { UpdateUserDto } from './dtos/update-user-dto';
import { CreateUserDto } from './dtos/create-user-dto';

// This should be a real class/interface representing a user entity
export type User = any;
@Injectable()
export class UsersService {
    constructor(
        @Inject(USERS_DATA) private readonly users: User[],
        // @Inject('EXTERNAL_USER_DATA_SERVICE') private readonly externalUserDataService: any
    ) {}

    createUser(user: CreateUserDto): User {
        const newUser = {
            ...user,
            id: this.users.length + 1
        };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(user: UpdateUserDto & { id: number }) {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index === -1) {
        throw new Error('User not found');
        }

        this.users[index] = {
        name: user.name ?? this.users[index].name,
        email: user.email ?? this.users[index].email,
        id: this.users[index].id,
        };

        return this.users[index];
    }
    
    findByEmail(email: string)  {
        return this.users.find(u => u.email == email)
    }

    async findAll(): Promise<User[]> {
        // const externalUsers = await this.externalUserDataService.fetchUsers();
        // return [...this.users, ...externalUsers];
        return this.users;
    }

    // implement findAll v2 with pagination
    async findAllV2(page: number = 1, limit: number = 5): Promise<{data: User[], meta: any}> {
        // const externalUsers = await this.externalUserDataService.fetchUsers();
        const allUsers = this.users; // [...this.users, ...externalUsers];
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
