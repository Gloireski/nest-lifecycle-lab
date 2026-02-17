import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user-dto';
import { USERS_DATA } from './users.constants';
import { mockUsersData } from './users.module';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: USERS_DATA,
        useValue: mockUsersData
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // create a const of the user we will create
  const newUser: CreateUserDto = {
    name: 'Kitoko Mwana',
    email: 'kitoko@test.com',
    address: '1234, Lubumbashi, DRC',
  };
  // then add one more test case to make sure our
  // service logic works
  it('should create a new user', () => {
    const user = service.createUser(newUser);
    expect(user).toBeDefined();
    expect(user.name).toBe(newUser.name);
    expect(user.email).toBe(newUser.email);
    expect(user.id).toBe(4); // new user id
  });

  it('should return an array of users', async () => {
    const users = await service.findAll();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].name).toBeDefined();
    expect(users[0].email).toBeDefined();
    expect(users[1].address).toBeDefined();
  })

  // findAll v2 with pagination
  it('should return paginated users', async () => {
    const users = service.findAllV2(1, 2);
    expect((await users).data.length).toBe(2);
    expect((await users).data[0].name).toBeDefined();
    expect((await users).meta).not.toBeNull();
    expect((await users).meta.page).toBe(1);
    expect((await users).meta.limit).toBe(2);
    expect((await users).meta.total).toBe(4); // total number of users

    // bad request with a wrong page number
    const users2 = service.findAllV2(100, 2);
    expect((await users2).data.length).toBe(0); // no data
    expect((await users2).meta).not.toBeNull(); // still return
    // meta
  })

  // users.service.spec.ts
  it('should update a user', () => {
    const user = service.updateUser({
      name: 'Tshimanga MUKENDI John',
      id: 1
    });
    expect(user).toBeDefined();
    expect(user.name).toBe(
    'Tshimanga MUKENDI John'
    ); // name has been updated
    expect(user.email).toBe(
      'admin@test.com'
    ); // email remains the same

    try {
      // should throw an error if user is not found
      service.updateUser({
      name: 'Tshimanga MUKENDI John',
      id: 100
    });
    } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toBe('User not found');
    }
  });
});
