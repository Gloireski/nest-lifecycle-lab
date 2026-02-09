import{ IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
 
export class CreateUserDto {
    @IsEmail()
    @ApiProperty({
      description: 'The email of the user',
      example: 'user@example.com'
    })
    email: string;

    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    // v2 fields
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address?: string;
}