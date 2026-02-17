import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { USERS_DATA } from './users.constants';
import { ExternalUserDataService } from 'src/external-services/external-user-data.service';
import { UsersController } from './users.controller';

const mockUsersService = {
  /* mock implementation
  ...
  */
};

export const mockUsersData = [
  {
      id: 1,
      email: 'admin@test.com',
      password: '$2a$12$hYd.ed33x4jrGR8qDKeIZuFzdl2eztlNJhUYsm4.YYXnyhJhOhcIO', // bcrypt hash
      name: 'Admin User',
      role: 'admin',
      address: '123 Main St' // V2 field
  },
  {
      id: 2,
      email: 'user1@test.com',
      password: '$2a$12$hYd.ed33x4jrGR8qDKeIZuFzdl2eztlNJhUYsm4.YYXnyhJhOhcIO', // bcrypt hash
      name: 'Regular User',
      role: 'user1',
      address: '1234, Goma, DRC',
  },
  {
      id: 3,
      email: 'user2@test.com',
      password: '$2a$12$hYd.ed33x4jrGR8qDKeIZuFzdl2eztlNJhUYsm4.YYXnyhJhOhcIO', // bcrypt hash
      name: 'Regular User',
      role: 'user1',
      address: '5678, Kinshasa, DRC',
  }
]

@Module({
  providers: [
    {
      provide: USERS_DATA,
      useValue: mockUsersData
    },
    // {
    //   provide: UsersService,
    //   useValue: mockUsersService
    // }
    UsersService,
    // {
    //   provide: 'EXTERNAL_USER_DATA_SERVICE',
    //   useClass: ExternalUserDataService
    // }
  ],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
