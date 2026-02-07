import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { PostsService } from './posts.service';
import { SimpleValidationPipe, TrimStringPipe, ValidationPipe } from 'src/common/pipes/validation.pipe';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { ZodValidationPipe } from 'src/common/pipes/ZodValidationPipe';
import { CreatePostDto, CreatePostSchema } from 'src/dto/create-post.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { TimingInterceptor } from 'src/common/interceptors/time.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { OwnershipGuard } from 'src/common/guards/ownership.guards';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
// import type { CreatePostDto } from 'src/dto/create-post.dto';


@UseInterceptors(TimingInterceptor)
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}
    // @Get(':id')
    // async findOne(@Param('id', new ParseIntPipe()) id) {
    //     return this.postsService.findOne(id);
    // }

    @Public()
    @Get()
    findAll(
    @Query('search') search?: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0
    ) {
        let posts = search ? this.postsService.findByText(search) : this.postsService.findAll();
        return posts.slice(offset, offset + limit);
    }

    @Get()
    search(
        @Query('search', TrimStringPipe) search?: string) {
            return search? this.postsService.findByText(search) : [];
        }


    // using nest pipes
    // @Post()
    // create(@Body(SimpleValidationPipe) Body: CreatePostDto) {
    //     return this.postsService.create(Body)
    // }

    // using pipes decorators with zod schema validation
    // @Post()
    // @UsePipes(new ZodValidationPipe(CreatePostSchema))
    // async create(@Body() createPostDto: CreatePostDto) {
    //     return this.postsService.create(Body)
    // }

    // using class validator library
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createPostDto: CreatePostDto,
        @CurrentUser('id') userId: number
    ) {
        return this.postsService.create(createPostDto, userId)
    }

    @UseGuards(JwtAuthGuard, OwnershipGuard)
    @Delete(':id')
    deletePost(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number) {
        return this.postsService.delete(id, userId)
    }

    @UseGuards(JwtAuthGuard, OwnershipGuard)
    @Patch(':id')
    updatePost(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreatePostDto,
        @CurrentUser('id') userId: number
    ) {
        const post = this.postsService.update(id, dto, userId);
        if (!post) throw new NotFoundException('Post not found or not owned')
        return post;
    }

    }



