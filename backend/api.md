# API 文档（v1）

Base URL：`/api/v1`

统一响应格式：

- 成功：`{ "data": ... , "pagination": ...? }`
- 失败：`{ "error": { "message": "xxx", "details": ["..."]? } }`

## 健康检查

- GET `/health`
- GET `/db/ping`

## 登录

- POST `/auth/login`

Request body：

```json
{ "username": "admin", "password": "123456" }
```

Response：

```json
{ "data": { "user": { "id": 1, "username": "admin", "name": "张管理", "phone": "...", "role": "超级管理员", "status": "启用", "created": "2024-01-10" } } }
```

## 用户 users

- GET `/users?page=1&pageSize=100&search=&role=&status=`
- POST `/users`
- GET `/users/:id`
- PUT `/users/:id`
- DELETE `/users/:id`

创建（POST）示例：

```json
{
  "username": "user9",
  "name": "测试用户",
  "phone": "138-0000-9999",
  "role": "普通用户",
  "status": "启用",
  "password": "123456"
}
```

## 分类 categories

- GET `/categories?page=1&pageSize=100&search=`
- POST `/categories`
- GET `/categories/:id`
- PUT `/categories/:id`
- DELETE `/categories/:id`

返回字段包含 `count`（该分类下药品数量）与 `desc`（描述）。

## 药品 medicines

- GET `/medicines?page=1&pageSize=100&search=&category=&status=`
- POST `/medicines`
- GET `/medicines/:id`
- PUT `/medicines/:id`
- DELETE `/medicines/:id`

创建（POST）示例：

```json
{
  "code": "YP999",
  "name": "测试药品",
  "category": "维生素类",
  "spec": "10mg×10片",
  "price": 9.9,
  "stock": 100,
  "expire": "2027-01-01",
  "maker": "测试厂家"
}
```

## 供应商 suppliers

- GET `/suppliers?page=1&pageSize=100&search=`
- POST `/suppliers`
- GET `/suppliers/:id`
- PUT `/suppliers/:id`
- DELETE `/suppliers/:id`

## 采购 procurement

- GET `/procurement?page=1&pageSize=100&search=&status=`
- POST `/procurement`
- GET `/procurement/:id`
- PUT `/procurement/:id`
- POST `/procurement/:id/approve`
- DELETE `/procurement/:id`

创建（POST）示例：

```json
{
  "code": "PO20249999",
  "medicine": "阿莫西林胶囊",
  "supplier": "华北制药总厂",
  "qty": 100,
  "price": 9.5,
  "date": "2026-03-27",
  "operator": "张管理",
  "status": "待审核",
  "note": ""
}
```

## 销售 sales

- GET `/sales?page=1&pageSize=100&search=&status=`
- POST `/sales`
- GET `/sales/:id`
- PUT `/sales/:id`
- DELETE `/sales/:id`

## 统计 stats

- GET `/stats`

返回：

- medicinesTotal：药品总数
- procurementMonthTotal：本月采购额（合计）
- salesMonthTotal：本月销售额（合计）
- stockWarningTotal：库存预警数量
- alerts：预警/不足列表（用于仪表盘展示）
- recentSales：最近销售记录
