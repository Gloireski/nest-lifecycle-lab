import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user-dto';
import { MockAuthGuard } from 'src/common/guards/mock-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Version('1')
    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    getAllUsers() {
        return this.usersService.findAll();
    }

    @ApiOperation({ summary: 'Get all users with pagination' })
    @ApiOkResponse({
        description: 'The users have been successfully retrieved. ',
        type: [Object],
    })
    @Version('2')
    @Public()
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    getAllUsersV2(page: number = 1, limit: number = 5) {
        return this.usersService.findAllV2(page, limit);
    }

    @Version('1')
    // @Public()
    @Post()
    @UseGuards(MockAuthGuard)
    createUser(@Body() CreateUserDto: CreateUserDto) {
        return this.usersService.createUser(CreateUserDto);
    }

    @Public()
    @UseGuards(MockAuthGuard)
    @Patch(':id')
    updateUser(
        @Body() updateUserDto: CreateUserDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.usersService.updateUser({...updateUserDto, id});
    }
}
