import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const setupTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
};

export const teardownTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

export const createTestAdmin = async (data = {}) => {
  const { Admin } = await import('../src/models/Admin.js');
  const defaultData = {
    username: 'testadmin',
    email: 'test@example.com',
    password: 'password123',
    role: 'admin'
  };
  return Admin.create({ ...defaultData, ...data });
};

export const createTestCategory = async (data = {}) => {
  const { Category } = await import('../src/models/Category.js');
  const defaultData = {
    name: 'Test Category',
    slug: 'test-category',
    description: 'Test description',
    icon: 'Folder',
    sortOrder: 0
  };
  return Category.create({ ...defaultData, ...data });
};

export const createTestApp = async (data = {}) => {
  const { App } = await import('../src/models/App.js');
  const defaultData = {
    name: 'Test App',
    slug: 'test-app',
    description: 'Test app description',
    url: 'https://example.com',
    icon: 'AppWindow',
    status: 'active',
    featured: false,
    sortOrder: 0
  };
  return App.create({ ...defaultData, ...data });
};

export const generateTestToken = (admin) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: admin._id, username: admin.username, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};