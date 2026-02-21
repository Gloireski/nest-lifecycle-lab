import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user-dto";
import { mockUsersData } from "./users.module";
import { MockAuthGuard } from "src/common/guards/mock-auth.guard";
import { mock } from "node:test";
import { instanceToPlain } from "class-transformer";

describe('UsersController', () => {
    let usersController: UsersController;
    let mockUsersService: Partial<UsersService>;

    beforeEach(async () => {
      mockUsersService = {
        // Mock the usersService methods user by the
        // UsersController
       createUser: jest.fn((dto) => ({
        ...dto,
        id: Date.now()
       })),
       // Add other methods as necessary
       findAll: jest.fn(() => Promise.resolve(mockUsersData)),
       updateUser: jest.fn((dto) => ({
        id: dto.id,
        name: dto.name || '',
        email: dto.email || '',
        password: dto.password || '',
        address: dto.address || '',
        role: dto.role || '',
        updatedAt: new Date()
       }))
      }

      const module: TestingModule = await Test
      .createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: mockUsersService
          }
        ]
      })
      .overrideGuard(MockAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // ✅ Mock le guard
      .compile();

      usersController = module.get<UsersController>(
        UsersController
      )
      // Reset mocks avant chaque test
      jest.clearAllMocks();
    })
    
    it('Should call getAll users on UsersService', async() => {
        const users = await usersController.getAllUsers();
        expect(mockUsersService.findAll).toHaveBeenCalled();
        expect(users).toEqual(mockUsersData);
    })

    it('should return users with correct structure', async () => {
        const users = await usersController.getAllUsers();

        users.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('role');
        expect(user).toHaveProperty('address');
        expect(user).toHaveProperty('password');
        });
    });

    // it('should not include passwords in response', async () => {
    //     const users = await usersController.getAllUsers(); 
    //     const serialized = instanceToPlain(users);

    //     serialized.forEach((user) => {
    //         expect(user.password).toBeUndefined();
    //     });
    // });

    it('should return empty array when no users', async () => {
        mockUsersService.findAll = jest.fn(() => Promise.resolve([]));

        const users = await usersController.getAllUsers();

        expect(users).toEqual([]);
        expect(users).toHaveLength(0);
    });

    it('should call UsersService to create a user', () => {
        const createUserDto: CreateUserDto = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'pwd124',
            address: '123 Main ST',
            role: 'user'
        };

        const user = usersController.createUser(createUserDto);
        expect(
            mockUsersService.createUser
        ).toHaveBeenCalledWith(createUserDto);

        expect(user).toEqual({
            ...createUserDto,
            id: expect.any(Number)
        });

        expect(user.id).toBeDefined();
    })

    describe('updateUser', () => {
        it('should require authorization', () => {
            // Le guard est mocké comme "canActivate: true"
            // Ce test vérifie que le guard est bien présent sur la route
            const guards = Reflect.getMetadata(
            '__guards__',
            UsersController.prototype.updateUser
            );

            expect(guards).toBeDefined();
            expect(guards).toContain(MockAuthGuard);
        });

        it('should call UsersService.updateUser with correct DTO and ID', () => {
            const updateUserDto: CreateUserDto = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'pwd124',
                address: '123 Main ST',
                role: 'user'
            };
            const userId = 1;

            usersController.updateUser(updateUserDto, userId);

            expect(mockUsersService.updateUser).toHaveBeenCalledWith({
                ...updateUserDto,
                id: userId,
            });

            expect(mockUsersService.updateUser).toHaveBeenCalledTimes(1);
        });

        it('should return the updated user', () => {
            const updateUserDto: CreateUserDto = {
                name: 'Updated User',
                email: 'updated@example.com',
                password: 'pwd124',
                address: '123 Main ST',
                role: 'user'
            };
            const userId = 5;

            const result = usersController.updateUser(updateUserDto, userId);

            expect(result).toEqual({
                ...updateUserDto,
                id: userId,
                updatedAt: expect.any(Date),
            });
        });
    })
});