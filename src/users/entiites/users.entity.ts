// users/entities/users.entity.ts

import { Exclude } from "class-transformer";

export class User {
    id: number;
    name: string;
    email: string;

    // V2 fields
    address?: string;
    role: string;
    updatedAt?: Date;

    @Exclude({ toPlainOnly: true }) // Exclut le champ password lors de la transformation en plain object
    password: string;
}