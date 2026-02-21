import { Test, TestingModule } from '@nestjs/testing';
import { 
    INestApplication,
    VersioningType
 } from '@nestjs/common';
import request from 'supertest'
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { domainToUnicode } from 'url';
import { CreateUserDto } from 'src/users/dtos/create-user-dto';

describe('User Management (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  })
  
  it('POST /v1/users - should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', 'Bearer mock-token') // add the mock token to the request object as a header
      .send({
        name: 'Justin Dusenge',
        email: 'justin@example.com',
        // address: 'Kigali, Rwanda',
      })
      .expect(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name)
      .toEqual('Justin Dusenge');
      expect(response.body.data.email)
      .toEqual('justin@example.com');
    const { data, success, timestamp } = response.body;

    expect(data).toHaveProperty('id');
    expect(data.name).toEqual('Justin Dusenge');
    expect(data.email).toEqual('justin@example.com');

    expect(success).toBe(true);

    expect(timestamp).toBeDefined();
  });

  it('GET /v1/users - should retrieve all users',
    async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/users')
      .expect(200);

      const { data, success, timestamp } = response.body;
      expect(Array.isArray(data)).toBeTruthy();
      expect(data[0]).toHaveProperty('name');

      expect(success).toBe(true);

      expect(timestamp).toBeDefined();
      // negative test
      // version 1 does not have address 
    //   expect(data[0]).not.toHaveProperty('address');
      // version 1 does not have pagination
      expect(data).not.toHaveProperty('meta');
  });

  it('GET /v2/users - should retrieve paginated users',
    async () => {
        const response = await request(app.getHttpServer())
        .get('/v2/users?page=1&limit=2')
        .expect(200);

        const { data, success } = response.body;
        // expect(Array.isArray(data)).toBeTruthy();
        expect(data.data.length).toBeGreaterThan(2);
        expect(data).toHaveProperty('meta');
        expect(data.meta).toHaveProperty('total');
        expect(data.meta.limit).toBe(5);
        expect(data.meta.page).toBe(1);
        expect(success).toBe(true);
        // expect(timestamp).toBeDefined();
    }
  )
});



