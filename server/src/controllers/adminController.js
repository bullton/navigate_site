import { Admin, App, Category } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供用户名和密码'
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = generateToken(admin);

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: '登出成功'
  });
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.admin
  });
};

export const getStats = async (req, res) => {
  try {
    const [totalApps, activeApps, categories, recentApps] = await Promise.all([
      App.countDocuments(),
      App.countDocuments({ status: 'active' }),
      Category.countDocuments(),
      App.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      success: true,
      data: {
        totalApps,
        activeApps,
        categories,
        recentApps
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取统计数据失败'
    });
  }
};