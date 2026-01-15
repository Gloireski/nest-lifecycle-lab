import { Injectable } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { Post } from "src/interfaces/post.interface";

@Injectable()
export class InMemoryPostsRepository implements PostsRepository {
  private posts: Post[] = [];
  private idCounter = 1;

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    return this.posts.find(p => p.id === id);
  }
  findByText(q: string): Post[] {
    return this.posts.filter(post =>
            post.title.toLowerCase().includes(q) ||
            post.content.toLowerCase().includes(q),
        );
  }

  create(post: Post) {
    post.id = this.idCounter++;
    this.posts.push(post);
    return post;
  }

  delete(id: number) {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    return this.posts.splice(index, 1)[0];
  }
  update(id: number, data: Partial<Post>): Post | undefined {
    const post = this.findOne(id);
    if (!post) return undefined;

    Object.assign(post, data);
    return post;
  }
}

