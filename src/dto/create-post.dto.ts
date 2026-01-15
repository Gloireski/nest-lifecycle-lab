import { z } from 'zod';
import { IsString, IsInt, Length } from 'class-validator';

// case 1
// export class CreatePostDto {
//     title: string
//     content: string
// }

// use case 2
export const CreatePostSchema = z
    .object({
        title: z.string(),
        content: z.string(),
    })
    .required()

// export type CreatePostDto = z.infer<typeof CreatePostSchema>

// case 3 using class validator 
export class CreatePostDto {
    @IsString()
    @Length(3, 100)
    title: string;

    @IsString()
    @Length(3, 1000)
    content: string;
}