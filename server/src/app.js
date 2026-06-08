import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import appRoutes from './routes/appRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import tokenPlanRoutes from './routes/tokenPlanRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import adminLinkRoutes from './routes/adminLinkRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/apps', appRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/links', adminLinkRoutes);
app.use('/api/token', tokenPlanRoutes);
app.use('/api/links', linkRoutes);

app.use(publicRoutes);
app.use('/admin', adminRoutes);
app.use('/admin/apps', appRoutes);
app.use('/admin/categories', categoryRoutes);
app.use('/admin/links', adminLinkRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '路由不存在'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
};

startServer();

export default app;