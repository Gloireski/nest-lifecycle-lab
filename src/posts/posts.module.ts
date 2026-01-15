import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { POSTS_DATA } from './posts.constants';
import { InMemoryPostsRepository } from 'src/repositories/in-memory-posts.repository';

const mockPostsService = {
  /* mock implementation
  ...
  */
};

@Module({
  controllers: [PostsController],
  providers: 
  [
    {
      provide: POSTS_DATA,
      useValue: mockPostsService
    },
    PostsService,
    {
      provide: 'POSTS_REPOSITORY',
      useClass: InMemoryPostsRepository,
    },
  ]
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(PostsController);
  }
}

