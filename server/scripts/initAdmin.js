import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from './src/models/index.js';

dotenv.config();

const initAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      await Admin.create({
        username: 'admin',
        email: 'admin@apphub.com',
        password: 'admin123',
        role: 'super_admin'
      });
      console.log('Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

initAdmin();