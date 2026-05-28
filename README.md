# 医药综合管理平台 v1.0

医药进销存综合管理系统，采用前后端分离架构，支持药品管理、采购管理、销售管理、供应商管理、分类管理、用户权限管理及数据统计分析等核心业务功能。

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端 | 原生 JavaScript（单页应用） | — |
| 后端 | Node.js + Express | ^4.21 |
| 数据库 | MySQL | 8.0+ |
| 认证 | JWT（JSON Web Token） | ^9.0 |
| 密码加密 | bcryptjs | ^3.0 |
| 请求校验 | Joi | ^17.13 |
| 速率限制 | express-rate-limit | ^8.5 |
| 代码规范 | ESLint + Prettier | ^10 / ^3 |
| 测试 | Jest | latest |

---

## 功能模块

- **仪表盘** — 药品总数、月度采购/销售总额、库存预警统计、近 7 天销售趋势图
- **药品管理** — 药品信息 CRUD、分类及库存状态筛选、库存预警自动计算
- **采购管理** — 采购单创建、审核与入库，审核时自动更新库存（事务保证）
- **销售管理** — 销售单创建、确认，确认时自动扣减库存并校验库存不足
- **供应商管理** — 供应商信息维护、评级管理、合作状态跟踪
- **分类管理** — 药品分类维护、分类下药品计数
- **用户管理** — 系统用户 CRUD、角色分配（超级管理员 / 管理员 / 普通用户）
- **认证授权** — JWT 令牌认证、基于角色的接口权限控制
- **审计日志** — 关键业务操作（采购审核、销售确认）自动记录审计轨迹
- **数据缓存** — 统计接口 1 分钟内存缓存，减少数据库压力

---

## 项目结构

```
医药综合管理平台 v1.0/
├── pharmacy-management.html     # 前端单页应用
├── backend/                     # 后端服务
│   ├── src/
│   │   ├── server.js            # 服务入口
│   │   ├── app.js               # Express 应用及中间件配置
│   │   ├── config.js            # 环境变量配置
│   │   ├── controllers/         # 控制器层（业务逻辑）
│   │   │   ├── auth.js          # 登录认证
│   │   │   ├── users.js         # 用户管理
│   │   │   ├── medicines.js     # 药品管理
│   │   │   ├── categories.js    # 分类管理
│   │   │   ├── suppliers.js     # 供应商管理
│   │   │   ├── procurement.js   # 采购管理
│   │   │   ├── sales.js         # 销售管理
│   │   │   └── stats.js         # 数据统计（含缓存）
│   │   ├── routes/              # 路由定义
│   │   ├── schemas/             # Joi 请求验证模式
│   │   ├── middleware/          # 中间件（认证、验证、错误处理）
│   │   ├── services/            # 业务服务层
│   │   │   ├── lookup.js        # 名称→ID 查找
│   │   │   └── audit.js         # 审计日志服务
│   │   ├── lib/                 # 公共工具库
│   │   │   ├── api-error.js     # 自定义错误类
│   │   │   ├── pagination.js    # 分页工具
│   │   │   └── helpers.js       # 通用工具函数
│   │   ├── db/pool.js           # MySQL 连接池
│   │   └── __tests__/           # 单元测试
│   │       ├── medicines.test.js
│   │       ├── procurement.test.js
│   │       └── sales.test.js
│   ├── scripts/
│   │   ├── seed.js              # 数据库初始化脚本
│   │   └── smoke-test.js        # 冒烟测试脚本
│   ├── api.md                   # API 接口文档
│   ├── .env.example             # 环境变量模板
│   ├── .eslintrc.json           # ESLint 配置
│   └── .prettierrc              # Prettier 配置
└── db/
    ├── init.sql                 # 建库建表 DDL（含 audit_log 表）
    └── seed.sql                 # 演示种子数据
```

---

## 数据库设计

系统数据库 `pharma_sys`，包含 7 张业务表 + 1 张审计日志表，均采用 InnoDB 引擎，字符集 `utf8mb4`。

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `users` | 系统用户 | username, password(bcrypt), role, status |
| `categories` | 药品分类 | name, code, sort, status |
| `medicines` | 药品信息 | code, name, category_id, spec, price, stock, expire_date, maker, status |
| `suppliers` | 供应商 | name, contact, phone, address, rating |
| `procurement_orders` | 采购订单 | code, medicine_id, supplier_id, qty, price, total, status |
| `sales_orders` | 销售订单 | code, medicine_id, qty, price, total, customer, status |
| `audit_log` | 审计日志 | user_id, username, action, resource, resource_id, detail, ip |

库存状态自动计算规则：`stock < 20` → 预警，`stock < 50` → 不足，其余 → 充足。

---

## 快速开始

### 环境要求

- **Node.js** 18+
- **MySQL** 8.0+
- **npm** 9+

验证环境：

```bash
node -v
npm -v
mysql --version
```

### 1. 克隆项目

```bash
git clone https://github.com/Tissue-for-charlie/Medication-Management-System.git
cd Medication-Management-System
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

编辑 `backend/.env`，根据本机 MySQL 配置修改：

```env
PORT=3001
NODE_ENV=development

# JWT 密钥（生产环境必须修改为强随机字符串）
JWT_SECRET=pharma_jwt_secret_2026

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=pharma_sys

DB_CONNECTION_LIMIT=10
CORS_ORIGIN=http://localhost:3001
```

> **安全提示**：生产环境中 `JWT_SECRET` 必须设置为强随机字符串，否则服务将拒绝启动。

### 4. 初始化数据库

```bash
npm run seed
```

该命令将自动执行建库、建表并导入演示数据。

### 5. 启动服务

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm start
```

终端输出 `API listening on http://localhost:3001` 即启动成功。

### 6. 访问系统

浏览器打开：**http://localhost:3001/pharmacy-management.html**

### 演示账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `123456` | 超级管理员 |
| `user1` | `123456` | 管理员 |
| `user2` | `123456` | 普通用户 |

---

## API 概览

所有 API 基于 `/api/v1` 路径前缀，统一 JSON 响应格式。完整文档见 [backend/api.md](backend/api.md)。

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/health` | 服务健康检查 |
| GET | `/api/v1/db/ping` | 数据库连通性检查 |
| POST | `/api/v1/auth/login` | 用户登录（频率限制：60秒最多5次） |

### 需认证接口

| 资源 | 端点 | 权限 |
|------|------|------|
| 用户管理 | `/api/v1/users` | 超级管理员 |
| 药品管理 | `/api/v1/medicines` | 所有登录用户 |
| 分类管理 | `/api/v1/categories` | 超级管理员 |
| 供应商管理 | `/api/v1/suppliers` | 超级管理员 |
| 采购管理 | `/api/v1/procurement` | 超级管理员 |
| 销售管理 | `/api/v1/sales` | 所有登录用户 |
| 数据统计 | `/api/v1/stats` | 超级管理员 |

### 统一响应格式

```json
// 成功
{ "data": { ... }, "pagination": { "page": 1, "pageSize": 8, "total": 50, "totalPages": 7 } }

// 失败
{ "error": { "message": "错误描述", "details": ["详细原因"] } }
```

---

## 自检验证

启动服务后，可运行冒烟测试验证核心功能：

```bash
cd backend
npm run smoke
```

运行单元测试：

```bash
cd backend
npm test
```

代码格式检查：

```bash
npm run lint
npm run format
```

测试内容：API 可用性、数据库连通性、基础列表接口、登录接口、Controller 单元测试。

---

## 安全说明

- `.env` 文件包含数据库密码等敏感信息，已通过 `.gitignore` 排除，**切勿提交至版本控制**
- 所有密码使用 bcrypt（10 轮 salt）哈希存储
- 所有 SQL 操作使用参数化查询（包括 LIMIT/OFFSET），防止 SQL 注入
- API 通过 JWT 令牌进行身份认证，令牌有效期 2 小时
- 生产环境 `JWT_SECRET` 强制配置，无默认回退值
- 登录接口含速率限制（60 秒最多 5 次），防止暴力破解
- 关键业务操作（采购审核、销售确认）使用数据库事务和行级锁保证数据一致性
- 前端已添加 XSS 防护（`escapeHtml`），所有用户数据在渲染前进行 HTML 转义
- 关键业务操作自动写入 `audit_log` 审计日志表

---

## License

本项目仅供学习与内部使用。
