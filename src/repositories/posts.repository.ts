import { Post } from "src/interfaces/post.interface";

// posts.repository.ts
export interface PostsRepository {
  findAll(): Post[];
  findOne(id: number): Post | undefined;
  findByText(query: string): Post[];
  create(post: Post): Post;
  delete(id: number): Post | undefined;
  update(id: number, data: Partial<Post>): Post | undefined;
}
