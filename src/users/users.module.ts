import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { USERS_DATA } from './users.constants';

const mockUsersService = {
  /* mock implementation
  ...
  */
};

@Module({
  providers: [
    {
      provide: USERS_DATA,
      useValue: [
        {
            id: 1,
            email: 'admin@test.com',
            password: '$2a$12$hYd.ed33x4jrGR8qDKeIZuFzdl2eztlNJhUYsm4.YYXnyhJhOhcIO', // bcrypt hash
            role: 'admin',
        },
        {
            id: 2,
            email: 'user1@test.com',
            password: '$2a$12$hYd.ed33x4jrGR8qDKeIZuFzdl2eztlNJhUYsm4.YYXnyhJhOhcIO', // bcrypt hash
            role: 'user1',
        }
      ]
    },
    // {
    //   provide: UsersService,
    //   useValue: mockUsersService
    // }
    UsersService,
  ],
  exports: [UsersService]
})
export class UsersModule {}
