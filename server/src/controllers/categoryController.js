import { Category } from '../models/index.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, createdAt: 1 });

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

export const createCategory = async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    };

    const existingCategory = await Category.findOne({ slug: categoryData.slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: '该 Slug 已存在'
      });
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: '分类创建成功',
      data: category
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
      message: '创建分类失败'
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    res.json({
      success: true,
      message: '分类更新成功',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新分类失败'
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    res.json({
      success: true,
      message: '分类删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除分类失败'
    });
  }
};