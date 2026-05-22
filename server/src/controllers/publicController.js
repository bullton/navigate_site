import { App, Category } from '../models/index.js';

export const getPublicApps = async (req, res) => {
  try {
    const apps = await App.find({ status: 'active' })
      .populate('category', 'name slug icon')
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      data: apps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取应用列表失败'
    });
  }
};

export const getPublicAppBySlug = async (req, res) => {
  try {
    const app = await App.findOne({
      slug: req.params.slug,
      status: 'active'
    }).populate('category', 'name slug icon');

    if (!app) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    app.metadata.viewCount += 1;
    app.metadata.lastAccessedAt = new Date();
    await app.save();

    res.json({
      success: true,
      data: app
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取应用详情失败'
    });
  }
};

export const getFeaturedApps = async (req, res) => {
  try {
    const apps = await App.find({ status: 'active', featured: true })
      .populate('category', 'name slug icon')
      .sort({ sortOrder: 1 });

    res.json({
      success: true,
      data: apps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取推荐应用失败'
    });
  }
};

export const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ sortOrder: 1, createdAt: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取分类列表失败'
    });
  }
};