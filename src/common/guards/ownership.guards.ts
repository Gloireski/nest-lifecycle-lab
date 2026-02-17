import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PostsService } from "../../posts/posts.service";

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const postId = +request.params.id;

    const post = await this.postsService.findOne(postId);
    if (!post) return false;

    if (user.role === 'admin') return true;
    return post?.userId === user.id;
  }
}
