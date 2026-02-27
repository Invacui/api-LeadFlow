import request from 'supertest';
import App from '@/app';
import { prisma } from '@/db/prisma';

const app = new App().getApp();

describe('Auth API', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Clean up after all tests
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /auth', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        city: 'Test City',
        zipCode: '12345',
      };

      const response = await request(app)
        .post('/auth')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return validation error for invalid data', async () => {
      const invalidUserData = {
        email: 'invalid-email',
        name: '',
        age: 'not-a-number',
        city: '',
        zipCode: 'invalid-zip',
      };

      const response = await request(app)
        .post('/auth')
        .send(invalidUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.details).toBeDefined();
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'Test User',
        age: 25,
        city: 'Test City',
        zipCode: '12345',
      };

      // Create first user
      await request(app)
        .post('/auth')
        .send(userData)
        .expect(201);

      // Try to create user with same email
      const response = await request(app)
        .post('/auth')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /auth', () => {
    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/auth')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return users for authenticated request', async () => {
      // Create a test user first
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        city: 'Test City',
        zipCode: '12345',
      };

      const createResponse = await request(app)
        .post('/auth')
        .send(userData)
        .expect(201);

      const token = createResponse.body.data.token;

      // Get all users with authentication
      const response = await request(app)
        .get('/auth')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('GET /auth/:userId', () => {
    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/auth/123')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return user for authenticated request', async () => {
      // Create a test user first
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        city: 'Test City',
        zipCode: '12345',
      };

      const createResponse = await request(app)
        .post('/auth')
        .send(userData)
        .expect(201);

      const token = createResponse.body.data.token;
      const userId = createResponse.body.data.user.id;

      // Get user by ID with authentication
      const response = await request(app)
        .get(`/auth/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.email).toBe(userData.email);
    });

    it('should return 404 for non-existent user', async () => {
      // Create a test user first
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        city: 'Test City',
        zipCode: '12345',
      };

      const createResponse = await request(app)
        .post('/auth')
        .send(userData)
        .expect(201);

      const token = createResponse.body.data.token;

      // Try to get non-existent user
      const response = await request(app)
        .get('/auth/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });
});
