// users/entities/users.entity.ts

export class User {
    id: number;
    name: string;
    email: string;

    // V2 fields
    address?: string;
}