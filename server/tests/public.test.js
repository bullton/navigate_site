import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Admin, App, Category } from '../src/models/index.js';

describe('Public API Routes', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('GET /api/apps', () => {
    it('should return empty array when no apps exist', async () => {
      const res = await request(app).get('/api/apps');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return only active apps', async () => {
      await App.create([
        { name: 'Active App', slug: 'active-app', url: 'https://active.com', status: 'active' },
        { name: 'Inactive App', slug: 'inactive-app', url: 'https://inactive.com', status: 'inactive' }
      ]);

      const res = await request(app).get('/api/apps');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Active App');
    });
  });

  describe('GET /api/apps/:slug', () => {
    it('should return app by slug', async () => {
      await App.create({
        name: 'Test App',
        slug: 'test-app',
        url: 'https://test.com',
        status: 'active'
      });

      const res = await request(app).get('/api/apps/test-app');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test App');
    });

    it('should return 404 for non-existent app', async () => {
      const res = await request(app).get('/api/apps/non-existent');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should increment view count', async () => {
      await App.create({
        name: 'Test App',
        slug: 'test-app',
        url: 'https://test.com',
        status: 'active',
        metadata: { viewCount: 0 }
      });

      await request(app).get('/api/apps/test-app');
      const appDoc = await App.findOne({ slug: 'test-app' });
      expect(appDoc.metadata.viewCount).toBe(1);
    });
  });

  describe('GET /api/apps/featured', () => {
    it('should return only featured apps', async () => {
      await App.create([
        { name: 'Featured App', slug: 'featured-app', url: 'https://featured.com', status: 'active', featured: true },
        { name: 'Regular App', slug: 'regular-app', url: 'https://regular.com', status: 'active', featured: false }
      ]);

      const res = await request(app).get('/api/apps/featured');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].featured).toBe(true);
    });
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      await Category.create([
        { name: 'AI Tools', slug: 'ai-tools', icon: 'Bot' },
        { name: 'Dev Tools', slug: 'dev-tools', icon: 'Code' }
      ]);

      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });
});