import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Admin, App, Category } from '../src/models/index.js';
import jwt from 'jsonwebtoken';

describe('App CRUD API Routes', () => {
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

  describe('GET /api/admin/apps', () => {
    it('should return all apps including inactive', async () => {
      await App.create([
        { name: 'Active App', slug: 'active-app', url: 'https://active.com', status: 'active' },
        { name: 'Inactive App', slug: 'inactive-app', url: 'https://inactive.com', status: 'inactive' }
      ]);

      const res = await request(app)
        .get('/api/admin/apps')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app).get('/api/admin/apps');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/admin/apps', () => {
    it('should create a new app', async () => {
      const res = await request(app)
        .post('/api/admin/apps')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'New App',
          slug: 'new-app',
          url: 'https://newapp.com',
          description: 'A new application',
          status: 'active'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('New App');
    });

    it('should generate slug from name if not provided', async () => {
      const res = await request(app)
        .post('/api/admin/apps')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'My Awesome App',
          url: 'https://myapp.com'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe('my-awesome-app');
    });

    it('should reject duplicate slug', async () => {
      await App.create({
        name: 'Existing App',
        slug: 'existing-app',
        url: 'https://existing.com'
      });

      const res = await request(app)
        .post('/api/admin/apps')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Another App',
          slug: 'existing-app',
          url: 'https://another.com'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/apps/:id', () => {
    it('should update an app', async () => {
      const app = await App.create({
        name: 'Original App',
        slug: 'original-app',
        url: 'https://original.com'
      });

      const res = await request(app)
        .put(`/api/admin/apps/${app._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated App' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Updated App');
    });

    it('should return 404 for non-existent app', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/admin/apps/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated App' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/admin/apps/:id', () => {
    it('should delete an app', async () => {
      const app = await App.create({
        name: 'App to Delete',
        slug: 'delete-app',
        url: 'https://delete.com'
      });

      const res = await request(app)
        .delete(`/api/admin/apps/${app._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      const deletedApp = await App.findById(app._id);
      expect(deletedApp).toBeNull();
    });
  });

  describe('PATCH /api/admin/apps/:id/toggle-status', () => {
    it('should toggle app status from active to inactive', async () => {
      const app = await App.create({
        name: 'Toggle App',
        slug: 'toggle-app',
        url: 'https://toggle.com',
        status: 'active'
      });

      const res = await request(app)
        .patch(`/api/admin/apps/${app._id}/toggle-status`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('inactive');
    });

    it('should toggle app status from inactive to active', async () => {
      const app = await App.create({
        name: 'Toggle App',
        slug: 'toggle-app',
        url: 'https://toggle.com',
        status: 'inactive'
      });

      const res = await request(app)
        .patch(`/api/admin/apps/${app._id}/toggle-status`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('active');
    });
  });
});