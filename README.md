# 密码管理器 (Password Manager)

一个安全的本地密码生成器和管理器，支持密码生成、存储和管理。

## 功能特性

- 🔐 **强密码生成器** - 可自定义长度、字符集和复杂度
- 💾 **本地安全存储** - 所有数据存储在本地，永不上传
- 🔍 **智能搜索** - 快速查找和筛选密码条目
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 📊 **密码强度分析** - 实时评估密码安全性
- 📤 **数据导入导出** - 支持备份和恢复功能
- 🎨 **现代化界面** - 简洁美观的用户体验

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **构建工具**: Vite
- **代码质量**: ESLint + TypeScript

## 开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
npm run typecheck
```

## 部署

### 自动化部署

项目配置了 GitHub Actions 工作流：

1. **持续集成** (`.github/workflows/ci.yml`)
   - 在每次推送到 main/develop 分支时运行
   - 执行类型检查、代码检查和构建

2. **构建和发布** (`.github/workflows/build-and-release.yml`)
   - 在创建新标签时自动触发
   - 构建生产版本并创建 GitHub Release

### 创建发布版本

```bash
# 创建新标签
git tag v1.0.0
git push origin v1.0.0
```

### 手动部署

构建完成后，`dist` 目录包含所有静态文件，可以部署到任何静态文件服务器：

- GitHub Pages
- Netlify
- Vercel
- 或任何支持静态文件的服务器

## 安全说明

- 所有密码数据仅存储在浏览器本地存储中
- 使用 Base64 编码提供基础的数据混淆
- 不会向任何服务器发送密码数据
- 建议定期导出数据进行备份

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！