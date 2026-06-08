import Link from '../models/Link.js';

export const getAllLinks = async (req, res) => {
  try {
    const links = await Link.find({ status: 'active' })
      .sort({ sortOrder: 1, createdAt: 1 });
    res.json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLink = async (req, res) => {
  try {
    const link = new Link(req.body);
    await link.save();
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLink = async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!link) {
      return res.status(404).json({ success: false, message: '链接不存在' });
    }
    res.json({ success: true, data: link });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);
    if (!link) {
      return res.status(404).json({ success: false, message: '链接不存在' });
    }
    res.json({ success: true, message: '链接已删除' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};