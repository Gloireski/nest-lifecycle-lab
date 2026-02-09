import { Controller, Get, Version } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Version('1')
    @Public()
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
    @Get()
    getAllUsersV2(page: number = 1, limit: number = 5) {
        return this.usersService.findAllV2(page, limit);
    }
}
