import { Inject, Injectable } from '@nestjs/common';
import { use } from 'passport';
import { CreatePostDto } from 'src/dto/create-post.dto';
import { Post } from 'src/interfaces/post.interface';
import type { PostsRepository } from 'src/repositories/posts.repository';

@Injectable()
export class PostsService {
    constructor(
        @Inject('POSTS_REPOSITORY')
        private readonly repo: PostsRepository,
    ) {}
    // private readonly posts: Post[] = [];
    // private idCounter = 1;
    findOne(id: number) {
        return this.repo.findOne(id);
    }
    // findOne(id: number): Post | undefined {
    //     return this.posts.find(post => post.id === id)
    // }
    findByText(query: string): Post[] {
        const q = query.toLowerCase();

        return this.repo.findByText(query);
    }

    findAll() {
        return this.repo.findAll();
    }

    create(dto: CreatePostDto, userId: number) {
        return this.repo.create({
            id: 0,
            ...dto,
            userId,
            createdAt: new Date(),
        });
    }
    delete(id: number, userId: number): Post | undefined {
        const post = this.repo.findOne(id);
        if (post?.userId !== userId) return undefined;
        this.repo.delete(id);
    }

    update(id: number, dto: CreatePostDto, userId: number): Post | undefined {
        const post = this.repo.findOne(id);
        console.log(post)
        console.log('UserId', userId)

        // business rule → ownership
        if (post?.userId !== userId) return undefined; // ownership check

        return this.repo.update(id, {
            title: dto.title,
            content: dto.content,
            updatedAt: new Date(),
        });
    }
}
