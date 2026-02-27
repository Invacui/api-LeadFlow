import request from 'supertest';
import App from '@/app';
import { prisma } from '@/db/prisma';

const app = new App().getApp();

describe('Auth API', () => {
  beforeEach(async () => {
    try {
      await prisma.user.deleteMany();
      await prisma.corporation.deleteMany();
    } catch { /* ignore in test env without DB */ }
  });

  afterAll(async () => {
    try {
      await prisma.user.deleteMany();
      await prisma.corporation.deleteMany();
      await prisma.$disconnect();
    } catch { /* ignore */ }
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/v1/health').expect(200);
      expect(response.body.success).toBe(true);
    });

    it('should return legacy health status', async () => {
      const response = await request(app).get('/health').expect(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/auth/signup', () => {
    it('should return 422 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({ email: 'invalid' })
        .expect(422);
      expect(response.body.success).toBe(false);
    });

    it('should return 422 for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({ email: 'not-an-email', name: 'Test', password: 'password123', corporationName: 'Test Corp' })
        .expect(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 422 for missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({})
        .expect(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app).get('/api/v1/auth/me').expect(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/v1/unknown-route').expect(404);
      expect(response.body.success).toBe(false);
    });
  });
});
