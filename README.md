# Pharma Sys（医药综合管理平台）

本项目为“前后端分离”的本地演示应用：

- 前端：单页 HTML（通过 Fetch 调用后端 REST API）
- 后端：Node.js + Express
- 数据库：MySQL

默认本地访问地址：`http://localhost:3001/pharmacy-management.html`

---

## 1. 目录结构

- `pharmacy-management.html`：前端页面（Fetch 调用 `/api/v1`）
- `backend/`：后端服务
  - `backend/src/server.js`：服务入口
  - `backend/src/app.js`：Express 应用与中间件
  - `backend/src/db/pool.js`：MySQL 连接池
  - `backend/api.md`：API 文档
- `db/`：MySQL 初始化脚本
  - `db/init.sql`：建库建表
  - `db/seed.sql`：种子数据

---

## 2. 环境要求

- Node.js 18+（建议 18/20；Node 18+ 内置 `fetch`，便于运行自检脚本）
- MySQL 8.0+

验证命令：

```bash
node -v
npm -v
```

---

## 3. 快速开始（Windows / PowerShell）

### 3.1 安装后端依赖

```powershell
cd "D:\下载\新建文件夹 (2)\backend"
npm install
```

### 3.2 配置环境变量

复制模板为 `.env`：

```powershell
cd "D:\下载\新建文件夹 (2)\backend"
copy .env.example .env
```

编辑 `backend/.env`，根据本机 MySQL 情况填写：

```env
PORT=3001
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=pharma_sys

DB_CONNECTION_LIMIT=10
CORS_ORIGIN=http://localhost:3001
```

说明：

- `DB_PASSWORD` 必须是真实密码；如果无密码，写成 `DB_PASSWORD=`（等号后留空）
- 如果 `3001` 端口被占用，可以改成 `3002/3101` 等，并同步修改 `CORS_ORIGIN`

### 3.3 初始化数据库（建库/建表/导入演示数据）

```powershell
cd "D:\下载\新建文件夹 (2)\backend"
npm run seed
```

脚本会执行 `db/init.sql` + `db/seed.sql`。

### 3.4 启动后端服务

开发模式（推荐）：

```powershell
cd "D:\下载\新建文件夹 (2)\backend"
npm run dev
```

生产模式：

```powershell
cd "D:\下载\新建文件夹 (2)\backend"
npm run start
```

看到 `API listening on http://localhost:3001` 即启动成功。

### 3.5 打开前端页面

后端启动后，用浏览器访问：

- `http://localhost:3001/pharmacy-management.html`

演示账号（种子数据内置）：

- `admin / 123456`
- `user1 / 123456`

---

## 4. 快速开始（macOS / Linux）

```bash
cd backend
npm install
cp .env.example .env
# 编辑 backend/.env
npm run seed
npm run dev
```

打开：`http://localhost:3001/pharmacy-management.html`

---

## 5. 自检与健康检查

### 5.1 健康检查接口

- `GET http://localhost:3001/api/v1/health`
- `GET http://localhost:3001/api/v1/db/ping`

### 5.2 冒烟测试

在后端目录执行：

```bash
cd backend
npm run smoke
```

会校验：

- API 可用
- 数据库连通
- 基础列表接口
- 登录接口

---

## 6. 常见问题排查

### 6.1 浏览器报 `ERR_CONNECTION_REFUSED`

- 后端没有启动，或端口不一致
- 解决：确认 `npm run dev` 正在运行，并访问与 `.env` 的 `PORT` 一致的地址

### 6.2 `Access denied for user ...`

- MySQL 用户名/密码错误
- 解决：确认 `backend/.env` 的 `DB_USER/DB_PASSWORD` 可用于本机 MySQL 登录

### 6.3 `Unknown database 'pharma_sys'`

- 数据库未初始化
- 解决：执行 `npm run seed`

### 6.4 `EADDRINUSE: address already in use :::3001`

- 3001 端口被占用
- 解决：修改 `backend/.env` 的 `PORT`，并重启后端

---

## 7. 接口文档

见 `backend/api.md`。

---

## 8. 安全提示

- `backend/.env` 属于本机配置文件，包含数据库密码，请勿提交到公开仓库。
