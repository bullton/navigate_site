import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category, App } from './src/models/index.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    await App.deleteMany({});

    const categories = await Category.insertMany([
      { name: 'AI 工具', slug: 'ai-tools', description: '人工智能相关工具', icon: 'Bot', sortOrder: 1 },
      { name: '开发工具', slug: 'dev-tools', description: '程序员开发必备工具', icon: 'Code', sortOrder: 2 },
      { name: '生产力', slug: 'productivity', description: '提高工作效率的应用', icon: 'Layers', sortOrder: 3 },
      { name: '设计工具', slug: 'design', description: '设计师专用工具', icon: 'Palette', sortOrder: 4 },
    ]);
    console.log('Categories created:', categories.length);

    const aiCategory = categories.find(c => c.slug === 'ai-tools');
    const devCategory = categories.find(c => c.slug === 'dev-tools');
    const prodCategory = categories.find(c => c.slug === 'productivity');

    const apps = await App.insertMany([
      {
        name: 'ChatGPT',
        slug: 'chatgpt',
        description: 'OpenAI 开发的 AI 对话助手，支持 GPT-4o 最新模型',
        url: 'https://chat.openai.com',
        icon: 'Bot',
        category: aiCategory._id,
        tags: ['AI', '对话', 'GPT-4'],
        status: 'active',
        featured: true,
        sortOrder: 1
      },
      {
        name: 'Claude',
        slug: 'claude',
        description: 'Anthropic 开发的 AI 助手，专注于安全性和有用性',
        url: 'https://claude.ai',
        icon: 'Sparkles',
        category: aiCategory._id,
        tags: ['AI', '对话', 'Claude'],
        status: 'active',
        featured: true,
        sortOrder: 2
      },
      {
        name: 'GitHub',
        slug: 'github',
        description: '全球最大的代码托管平台和开发者社区',
        url: 'https://github.com',
        icon: 'Code',
        category: devCategory._id,
        tags: ['代码托管', '协作', '开源'],
        status: 'active',
        featured: true,
        sortOrder: 1
      },
      {
        name: 'Vercel',
        slug: 'vercel',
        description: '极简主义的网站部署平台，支持前端框架一键部署',
        url: 'https://vercel.com',
        icon: 'Globe',
        category: devCategory._id,
        tags: ['部署', '前端', 'Serverless'],
        status: 'active',
        featured: false,
        sortOrder: 2
      },
      {
        name: 'Notion',
        slug: 'notion',
        description: '强大的笔记和协作工具，打造你的数字工作空间',
        url: 'https://notion.so',
        icon: 'FileText',
        category: prodCategory._id,
        tags: ['笔记', '协作', '知识管理'],
        status: 'active',
        featured: true,
        sortOrder: 1
      },
      {
        name: 'Figma',
        slug: 'figma',
        description: '基于浏览器的协作界面设计工具',
        url: 'https://figma.com',
        icon: 'Palette',
        category: categories.find(c => c.slug === 'design')._id,
        tags: ['设计', 'UI', '协作'],
        status: 'active',
        featured: true,
        sortOrder: 1
      },
      {
        name: 'Cursor',
        slug: 'cursor',
        description: 'AI 代码编辑器，基于 VS Code 构建',
        url: 'https://cursor.sh',
        icon: 'Terminal',
        category: devCategory._id,
        tags: ['AI', 'IDE', '代码生成'],
        status: 'active',
        featured: true,
        sortOrder: 3
      },
      {
        name: 'Midjourney',
        slug: 'midjourney',
        description: '强大的 AI 图像生成工具，通过 Discord 使用',
        url: 'https://www.midjourney.com',
        icon: 'Image',
        category: aiCategory._id,
        tags: ['AI', '图像生成', '创意'],
        status: 'active',
        featured: false,
        sortOrder: 3
      },
    ]);
    console.log('Apps created:', apps.length);

    await mongoose.disconnect();
    console.log('Seed data inserted successfully!');
    console.log('\nSample Data:');
    console.log('- 4 Categories');
    console.log('- 8 Apps (including featured ones)');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedData();