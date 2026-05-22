import { App } from '../models/index.js';

export const getAllApps = async (req, res) => {
  try {
    const apps = await App.find()
      .populate('category', 'name slug icon')
      .sort({ sortOrder: 1, createdAt: -1 });

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

export const createApp = async (req, res) => {
  try {
    const appData = {
      ...req.body,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    };

    const existingApp = await App.findOne({ slug: appData.slug });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: '该 Slug 已存在'
      });
    }

    const app = await App.create(appData);
    await app.populate('category', 'name slug icon');

    res.status(201).json({
      success: true,
      message: '应用创建成功',
      data: app
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: '该 Slug 已存在'
      });
    }
    res.status(500).json({
      success: false,
      message: '创建应用失败'
    });
  }
};

export const updateApp = async (req, res) => {
  try {
    const app = await App.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug icon');

    if (!app) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    res.json({
      success: true,
      message: '应用更新成功',
      data: app
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新应用失败'
    });
  }
};

export const deleteApp = async (req, res) => {
  try {
    const app = await App.findByIdAndDelete(req.params.id);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    res.json({
      success: true,
      message: '应用删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除应用失败'
    });
  }
};

export const toggleAppStatus = async (req, res) => {
  try {
    const app = await App.findById(req.params.id);

    if (!app) {
      return res.status(404).json({
        success: false,
        message: '应用不存在'
      });
    }

    const statusMap = { active: 'inactive', inactive: 'active', maintenance: 'inactive' };
    app.status = statusMap[app.status] || 'active';
    await app.save();
    await app.populate('category', 'name slug icon');

    res.json({
      success: true,
      message: '状态更新成功',
      data: app
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新状态失败'
    });
  }
};