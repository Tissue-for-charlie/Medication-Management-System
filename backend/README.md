# Pharma Sys（本地前后端分离演示）

## 目录结构

- [pharmacy-management.html](file:///d:/下载/新建文件夹%20(2)/pharmacy-management.html)：前端单页（Fetch调用后端API）
- [backend](file:///d:/下载/新建文件夹%20(2)/backend)：Node.js/Express 后端服务
- [db](file:///d:/下载/新建文件夹%20(2)/db)：MySQL建表与种子数据

## 环境要求

- Node.js 18+（内置 fetch，便于运行验收脚本）
- MySQL 8.0+

## 本地启动（推荐）

1) 安装后端依赖

```bash
cd backend
npm install
```

2) 配置环境变量

```bash
cd backend
copy .env.example .env
```

编辑 `.env`，填入 MySQL 连接信息（DB_HOST/DB_USER/DB_PASSWORD/DB_NAME 等）。

3) 初始化数据库

```bash
cd backend
npm run seed
```

4) 启动后端

```bash
cd backend
npm run dev
```

5) 打开页面

- http://localhost:3001/pharmacy-management.html

登录演示账号：

- admin / 123456
- user1 / 123456

## 接口文档

见 [api.md](file:///d:/下载/新建文件夹%20(2)/backend/api.md)

## 常见问题

- 连接失败：确认 MySQL 服务已启动、账号密码正确、端口未被占用。
- 数据为空：确认已执行 `npm run seed`，且 `.env` 的 DB_NAME 与脚本里创建的库名一致（默认 `pharma_sys`）。
