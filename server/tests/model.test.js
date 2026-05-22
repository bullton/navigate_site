import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Admin, App, Category } from '../src/models/index.js';
import jwt from 'jsonwebtoken';

describe('Model Tests', () => {
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

  describe('App Model', () => {
    it('should create an app with required fields', async () => {
      const appData = {
        name: 'Test App',
        slug: 'test-app',
        url: 'https://test.com'
      };
      const app = await App.create(appData);
      expect(app._id).toBeDefined();
      expect(app.name).toBe('Test App');
      expect(app.status).toBe('active');
    });

    it('should auto-generate slug from name', async () => {
      const appData = {
        name: 'My Test App',
        url: 'https://test.com'
      };
      const app = await App.create(appData);
      expect(app.slug).toBe('my-test-app');
    });

    it('should track view count on save', async () => {
      const app = await App.create({
        name: 'View Test App',
        slug: 'view-test-app',
        url: 'https://test.com',
        status: 'active'
      });

      expect(app.metadata.viewCount).toBe(0);

      app.metadata.viewCount = 5;
      await app.save();

      const updatedApp = await App.findById(app._id);
      expect(updatedApp.metadata.viewCount).toBe(5);
    });
  });

  describe('Category Model', () => {
    it('should create a category', async () => {
      const category = await Category.create({
        name: 'Test Category',
        slug: 'test-category'
      });
      expect(category._id).toBeDefined();
      expect(category.name).toBe('Test Category');
    });

    it('should enforce unique slug', async () => {
      await Category.create({
        name: 'Category 1',
        slug: 'unique-slug'
      });

      await expect(
        Category.create({
          name: 'Category 2',
          slug: 'unique-slug'
        })
      ).rejects.toThrow();
    });
  });

  describe('Admin Model', () => {
    it('should hash password on save', async () => {
      const admin = await Admin.create({
        username: 'testadmin',
        email: 'test@test.com',
        password: 'plainpassword'
      });

      expect(admin.password).not.toBe('plainpassword');
      const isMatch = await admin.comparePassword('plainpassword');
      expect(isMatch).toBe(true);
    });

    it('should not return password in JSON output', async () => {
      const admin = await Admin.create({
        username: 'testadmin2',
        email: 'test2@test.com',
        password: 'password'
      });

      const json = admin.toJSON();
      expect(json.password).toBeUndefined();
    });
  });
});