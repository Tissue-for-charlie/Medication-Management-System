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
│   ├── models.py             # 数据模型
│   ├── schemas.py            # 数据验证模式
│   ├── crud.py               # 数据操作
│   ├── database.py           # 数据库配置
│   └── requirements.txt      # 依赖包
└── README.md                 # 项目说明
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

## API 接口

- `GET /` - 根路径，返回系统信息
- `POST /api/medications/` - 创建药品
- `GET /api/medications/` - 获取药品列表
- `GET /api/medications/{id}` - 获取指定药品
- `PUT /api/medications/{id}` - 更新指定药品
- `DELETE /api/medications/{id}` - 删除指定药品

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

## 部署

### 生产环境部署

1. 构建前端：
   ```bash
   cd frontend
   npm run build
   ```

2. 启动后端服务：
   ```bash
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## 贡献

我们欢迎社区贡献！如果您想为项目做出贡献，请按照以下步骤操作：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/FeatureName`)
3. 提交更改 (`git commit -m 'Add some FeatureName'`)
4. 推送到分支 (`git push origin feature/FeatureName`)
5. 创建 Pull Request

## 许可证

此项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。