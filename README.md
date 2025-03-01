# 个人博客系统

一个使用 Nuxt 3 + Vue 3 + TypeScript + Supabase 构建的现代化个人博客系统。支持文章管理、分类管理、Markdown 内容渲染，以及自适应的暗黑模式。

## 功能特点

- 💡 现代化的技术栈
  - Nuxt 3 框架
  - Vue 3 组件化开发
  - TypeScript 类型支持
  - Supabase 后端服务
  - TailwindCSS 样式框架

- 📝 博客功能
  - 文章的创建、编辑、删除
  - Markdown 内容支持
  - 文章分类管理
  - 标签系统
  - 草稿/发布状态控制

- 👤 用户体验
  - 响应式设计，支持移动端
  - 自动暗黑模式（根据时间切换）
  - 优雅的加载状态
  - Toast 通知系统

## 项目结构

```
├── components/          # 可复用的 Vue 组件
├── composables/         # 组合式函数
├── layouts/            # 页面布局
├── pages/              # 页面组件
│   ├── admin/         # 管理后台
│   │   ├── posts.vue  # 文章管理
│   │   ├── new.vue    # 新建文章
│   │   └── edit/      # 编辑文章
│   ├── blog/          # 博客前台
│   │   └── [id].vue   # 文章详情
│   └── index.vue      # 首页
├── stores/            # Pinia 状态管理
├── types/             # TypeScript 类型定义
└── utils/             # 工具函数
```

## 数据库结构

### Posts 表
```sql
create table posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text,
  excerpt text,
  category_id uuid references categories(id),
  author_id uuid references auth.users(id),
  published boolean default false,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

### Categories 表
```sql
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 权限控制

- 游客：可以查看已发布的文章
- 登录用户：可以查看自己的草稿
- 管理员：可以管理所有文章和分类

## 开发设置

1. 安装依赖：
```bash
npm install
```

2. 环境变量配置：
```bash
# .env
SUPABASE_URL=你的_SUPABASE_URL
SUPABASE_KEY=你的_SUPABASE_ANON_KEY
```

3. 启动开发服务器：
```bash
npm run dev
```

## 部署

### Vercel 部署

1. **准备工作**

- 确保你有一个 [Vercel](https://vercel.com) 账号
- 确保你的项目已经推送到 GitHub 仓库

2. **部署步骤**

- 在 Vercel 控制台点击 "New Project"
- 导入你的 GitHub 仓库
- 配置以下构建设置：
  - Framework Preset: Nuxt.js
  - Build Command: \`npm run build\`
  - Output Directory: \`.output/public\`

3. **环境变量配置**

在 Vercel 项目设置中添加以下环境变量：

\`\`\`
SUPABASE_URL=你的_SUPABASE_URL
SUPABASE_KEY=你的_SUPABASE_ANON_KEY
NITRO_PRESET=vercel
\`\`\`

4. **自动部署**

- 每次推送到主分支时，Vercel 会自动构建和部署
- 可以在 Vercel 仪表板查看部署状态和日志

5. **自定义域名**（可选）

- 在 Vercel 项目设置中添加你的自定义域名
- 按照指引配置 DNS 记录

### 本地预览部署

1. 构建生产版本：
\`\`\`bash
npm run build
\`\`\`

2. 预览构建结果：
\`\`\`bash
npm run preview
\`\`\`

## 技术栈

- [Nuxt 3](https://nuxt.com/) - Vue.js 框架
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Supabase](https://supabase.com/) - 开源的 Firebase 替代品
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Marked](https://marked.js.org/) - Markdown 解析器

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
