import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Admin, Category } from '../src/models/index.js';
import jwt from 'jsonwebtoken';

describe('Category CRUD API Routes', () => {
  let mongoServer;
  let admin;
  let token;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    admin = await Admin.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
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

    admin = await Admin.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/admin/categories', () => {
    it('should return all categories', async () => {
      await Category.create([
        { name: 'AI Tools', slug: 'ai-tools' },
        { name: 'Dev Tools', slug: 'dev-tools' }
      ]);

      const res = await request(app)
        .get('/api/admin/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app).get('/api/admin/categories');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/admin/categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New Category',
          slug: 'new-category',
          description: 'A new category',
          icon: 'Folder'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('New Category');
    });

    it('should generate slug from name if not provided', async () => {
      const res = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'My Category'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe('my-category');
    });

    it('should reject duplicate slug', async () => {
      await Category.create({
        name: 'Existing Category',
        slug: 'existing-category'
      });

      const res = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Another Category',
          slug: 'existing-category'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/categories/:id', () => {
    it('should update a category', async () => {
      const category = await Category.create({
        name: 'Original Category',
        slug: 'original-category'
      });

      const res = await request(app)
        .put(`/api/admin/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Category' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Updated Category');
    });

    it('should return 404 for non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/admin/categories/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Category' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/admin/categories/:id', () => {
    it('should delete a category', async () => {
      const category = await Category.create({
        name: 'Category to Delete',
        slug: 'delete-category'
      });

      const res = await request(app)
        .delete(`/api/admin/categories/${category._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      const deletedCategory = await Category.findById(category._id);
      expect(deletedCategory).toBeNull();
    });
  });
});