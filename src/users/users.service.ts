import { Inject, Injectable } from '@nestjs/common';
import { string } from 'zod';
import { USERS_DATA } from './users.constants';

// This should be a real class/interface representing a user entity
export type User = any;
@Injectable()
export class UsersService {
    constructor(
        @Inject(USERS_DATA) private readonly users: any [],
    ) {}
    
    findByEmail(email: string)  {
        return this.users.find(u => u.email == email)
    }
}
