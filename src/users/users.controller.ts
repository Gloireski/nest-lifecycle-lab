import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Get()
    getAllUsers() {
        return this.usersService.findAll();
    }
}
