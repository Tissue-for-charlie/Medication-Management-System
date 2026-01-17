# 药物管理系统 (Medication Management System)

## 项目简介

这是一个现代化的药物管理系统，采用前后端分离架构，实现了完整的药品管理功能，包括药品信息管理、库存管理、处方管理等功能模块。

## 技术栈

- **前端**: Vue 3 + TypeScript
- **后端**: FastAPI (Python)
- **数据库**: MySQL
- **API规范**: RESTful
- **包管理**: npm (前端)，pip (后端)

## 功能特性

- 药品信息管理 (增删改查)
- 库存管理
- 处方管理
- 用户权限管理
- 数据统计分析

## 系统功能概述

本系统为医药管理系统，主要功能包括：

### 个人信息管理
- 功能描述：管理员个人资料的查看和修改
- 主要操作：
  - 查看个人信息
  - 修改密码
  - 更新联系方式

### 用户信息管理
- 功能描述：系统用户的增删改查操作
- 主要操作：
  - 添加新用户
  - 编辑用户信息
  - 删除用户
  - 查询用户列表

### 分类信息管理
- 功能描述：药品分类体系的维护
- 主要操作：
  - 创建药品分类
  - 编辑分类信息
  - 删除分类
  - 分类层级管理

### 药品信息管理
- 功能描述：药品基本信息的全面管理
- 主要操作：
  - 添加新药品
  - 编辑药品信息
  - 删除药品
  - 查询药品信息
  - 药品库存监控

### 销售信息管理
- 功能描述：药品销售记录的管理
- 主要操作：
  - 记录销售交易
  - 查询销售历史
  - 生成销售报表
  - 销售数据分析

### 采购信息管理
- 功能描述：药品采购记录的管理
- 主要操作：
  - 创建采购订单
  - 管理采购流程
  - 查询采购历史
  - 采购成本分析

### 供应商信息管理
- 功能描述：药品供应商信息的维护
- 主要操作：
  - 添加供应商
  - 编辑供应商信息
  - 删除供应商
  - 供应商评估

### 退货信息管理
- 功能描述：药品退货处理流程
- 主要操作：
  - 处理退货申请
  - 审核退货请求
  - 记录退货信息
  - 退货原因分析

## 项目结构

```
Medication-Management-System/
├── frontend/                 # 前端代码
│   ├── public/               # 静态资源
│   ├── src/                  # 源代码
│   │   ├── components/       # 组件
│   │   ├── views/            # 页面视图
│   │   ├── router/           # 路由配置
│   │   └── stores/           # 状态管理
│   ├── package.json          # 项目配置
│   └── tsconfig.json         # TypeScript配置
├── backend/                  # 后端代码
│   ├── main.py               # 主应用文件
│   ├── models/               # 数据模型
│   ├── schemas/              # 数据验证模式
│   ├── services/             # 业务逻辑
│   ├── routes/               # API路由
│   ├── crud.py               # 数据操作
│   ├── database.py           # 数据库配置
│   └── requirements.txt      # 依赖包
└── README.md                 # 项目说明
```

## 数据库设计

```sql
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id INT DEFAULT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- 药品表
CREATE TABLE medications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category_id INT,
    specification VARCHAR(100),
    unit_price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    min_stock_level INT DEFAULT 10,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 供应商表
CREATE TABLE suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 采购表
CREATE TABLE purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medication_id INT,
    supplier_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    purchase_date DATE,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES medications(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- 销售表
CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medication_id INT,
    customer_name VARCHAR(100),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    sale_date DATE,
    payment_method ENUM('cash', 'credit_card', 'wechat', 'alipay'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- 退货表
CREATE TABLE returns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sale_id INT,
    medication_id INT,
    quantity INT,
    reason VARCHAR(255),
    return_date DATE,
    status ENUM('pending', 'approved', 'rejected'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sale_id) REFERENCES sales(id),
    FOREIGN KEY (medication_id) REFERENCES medications(id)
);
```

## API 接口规范

```json
// 用户信息管理接口
GET    /api/users             // 获取用户列表
POST   /api/users             // 创建新用户
GET    /api/users/{id}        // 获取指定用户
PUT    /api/users/{id}        // 更新用户信息
DELETE /api/users/{id}        // 删除用户

// 分类信息管理接口
GET    /api/categories        // 获取分类列表
POST   /api/categories        // 创建新分类
GET    /api/categories/{id}   // 获取指定分类
PUT    /api/categories/{id}   // 更新分类信息
DELETE /api/categories/{id}   // 删除分类

// 药品信息管理接口
GET    /api/medications       // 获取药品列表
POST   /api/medications       // 创建新药品
GET    /api/medications/{id}  // 获取指定药品
PUT    /api/medications/{id}  // 更新药品信息
DELETE /api/medications/{id}  // 删除药品

// 供应商信息管理接口
GET    /api/suppliers         // 获取供应商列表
POST   /api/suppliers         // 创建新供应商
GET    /api/suppliers/{id}    // 获取指定供应商
PUT    /api/suppliers/{id}    // 更新供应商信息
DELETE /api/suppliers/{id}    // 删除供应商

// 采购信息管理接口
GET    /api/purchases         // 获取采购列表
POST   /api/purchases         // 创建采购订单
GET    /api/purchases/{id}    // 获取指定采购订单
PUT    /api/purchases/{id}    // 更新采购订单
DELETE /api/purchases/{id}    // 删除采购订单

// 销售信息管理接口
GET    /api/sales             // 获取销售列表
POST   /api/sales             // 创建销售记录
GET    /api/sales/{id}        // 获取指定销售记录
PUT    /api/sales/{id}        // 更新销售记录
DELETE /api/sales/{id}        // 删除销售记录

// 退货信息管理接口
GET    /api/returns           // 获取退货列表
POST   /api/returns           // 创建退货记录
GET    /api/returns/{id}      // 获取指定退货记录
PUT    /api/returns/{id}      // 更新退货记录
DELETE /api/returns/{id}      // 删除退货记录
```

## 快速开始

### 前端设置

1. 进入前端目录：
   ```bash
   cd frontend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

### 后端设置

1. 进入后端目录：
   ```bash
   cd backend
   ```

2. 创建虚拟环境：
   ```bash
   python -m venv venv
   ```

3. 激活虚拟环境：
   ```bash
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

4. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

5. 配置数据库连接：
   创建 `.env` 文件并配置数据库连接信息：
   ```
   DATABASE_URL=mysql+mysqlconnector://username:password@localhost/database_name
   ```

6. 启动后端服务：
   ```bash
   python -m uvicorn backend.main:app --reload --port 8000
   ```

## 开发指南

### 前端开发

- 使用 Vue 3 和 Composition API
- 类型检查使用 TypeScript
- 状态管理使用 Pinia
- 路由管理使用 Vue Router
- UI 组件使用原生 HTML/CSS

### 后端开发

- 使用 FastAPI 框架
- 数据库 ORM 使用 SQLAlchemy
- 数据验证使用 Pydantic
- 异常处理遵循 FastAPI 规范

## 运行环境要求

- **前端**: 
  - Node.js v16+
  - npm 或 yarn
  - Vue 3 + TypeScript
  - Vite 构建工具

- **后端**:
  - Python 3.8+
  - pip 包管理器
  - FastAPI
  - SQLAlchemy
  - MySQL

- **数据库**:
  - MySQL 8.0+

## 部署方案

1. **开发环境**:
   - 前端: `npm run dev` 在 http://localhost:3000
   - 后端: `uvicorn app.main:app --reload` 在 http://localhost:8000

2. **生产环境**:
   - 使用 Nginx 作为反向代理
   - 使用 Gunicorn 或 Uvicorn 运行 FastAPI 应用
   - 配置 HTTPS 和负载均衡

3. **数据库部署**:
   - MySQL 实例部署在独立服务器或云数据库服务
   - 配置主从复制和备份策略

## 安全考虑

- **身份验证**: JWT Token 认证机制
- **权限控制**: 基于角色的访问控制（RBAC）
- **数据加密**: 敏感数据加密存储
- **输入验证**: 所有用户输入进行严格验证
- **日志审计**: 关键操作记录审计日志

## 扩展性设计

- **模块化架构**: 各功能模块独立开发和部署
- **API版本控制**: 支持多版本API共存
- **微服务架构**: 可逐步拆分为独立微服务
- **消息队列**: 引入消息队列处理异步任务
- **缓存机制**: 使用Redis缓存热点数据

## 贡献

我们欢迎社区贡献！如果您想为项目做出贡献，请按照以下步骤操作：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/FeatureName`)
3. 提交更改 (`git commit -m 'Add some FeatureName'`)
4. 推送到分支 (`git push origin feature/FeatureName`)
5. 创建 Pull Request

## 许可证

此项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。