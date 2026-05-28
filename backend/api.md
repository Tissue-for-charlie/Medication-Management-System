# API 文档（v1.0）

Base URL：`/api/v1`

## 统一响应格式

- 成功：`{ "data": ... , "pagination": ...? }`
- 失败：`{ "error": { "message": "xxx", "details": ["..."]? } }`

## HTTP 状态码说明

| 状态码 | 含义 | 触发场景 |
|--------|------|----------|
| 200 | 成功 | 查询、更新、删除操作成功 |
| 201 | 已创建 | 创建新资源成功 |
| 400 | 请求错误 | 参数校验失败、业务状态不匹配、库存不足等 |
| 401 | 未认证 | 未提供令牌、令牌过期或无效、账号密码错误 |
| 403 | 无权限 | 角色权限不足、CORS 拦截 |
| 404 | 未找到 | 资源不存在、路由不存在 |
| 409 | 冲突 | 唯一约束冲突（编码/用户名重复）、外键引用阻止删除 |
| 429 | 请求过多 | 登录频率超限（每分钟最多 5 次） |
| 500 | 服务器错误 | 数据库连接失败、未预期的运行时错误 |

## 认证说明

- 登录成功后返回 JWT 令牌，有效期 2 小时
- 请求受保护接口时需在 Header 中携带：`Authorization: Bearer <token>`
- 令牌过期需重新登录获取

---

## 健康检查

- GET `/health` — 服务健康检查
- GET `/db/ping` — 数据库连通性检查

---

## 登录

- POST `/auth/login`（公开接口，含频率限制：60秒内最多5次）

Request body：

```json
{ "username": "admin", "password": "123456" }
```

Response：

```json
{
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "name": "张管理",
      "phone": "138-0000-0001",
      "role": "超级管理员",
      "status": "启用",
      "created": "2024-01-10"
    },
    "token": "eyJhbGciOi...",
    "tokenType": "Bearer"
  }
}
```

可能的错误：`401` 账号或密码错误 / 账号已禁用，`429` 登录过于频繁

---

## 用户 users

权限：超级管理员

- GET `/users?page=1&pageSize=100&search=&role=&status=` — 用户列表
- POST `/users` — 创建用户（`400` 参数校验失败，`409` 用户名已存在）
- GET `/users/:id` — 用户详情（`404` 用户不存在）
- PUT `/users/:id` — 更新用户（`400` 无可更新字段，`404` 用户不存在，`409` 用户名冲突）
- DELETE `/users/:id` — 删除用户（`404` 用户不存在）

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

---

## 分类 categories

权限：超级管理员

- GET `/categories?page=1&pageSize=100&search=` — 分类列表
- POST `/categories` — 创建分类（`409` 分类编码已存在）
- GET `/categories/:id` — 分类详情（`404` 分类不存在）
- PUT `/categories/:id` — 更新分类（`409` 分类编码已存在）
- DELETE `/categories/:id` — 删除分类（`409` 该分类下仍有关联药品，`404` 分类不存在）

返回字段包含 `count`（该分类下药品数量）与 `desc`（描述）。

---

## 药品 medicines

权限：所有登录用户

- GET `/medicines?page=1&pageSize=100&search=&category=&status=` — 药品列表
- POST `/medicines` — 创建药品（`400` 分类不存在，`409` 药品编码已存在）
- GET `/medicines/:id` — 药品详情（`404` 药品不存在）
- PUT `/medicines/:id` — 更新药品（`400` 分类不存在，`409` 药品编码已存在）
- DELETE `/medicines/:id` — 删除药品（`409` 该药品已产生订单记录，`404` 药品不存在）

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

---

## 供应商 suppliers

权限：超级管理员

- GET `/suppliers?page=1&pageSize=100&search=` — 供应商列表
- POST `/suppliers` — 创建供应商（`409` 供应商名称已存在）
- GET `/suppliers/:id` — 供应商详情（`404` 供应商不存在）
- PUT `/suppliers/:id` — 更新供应商（`409` 供应商名称已存在）
- DELETE `/suppliers/:id` — 删除供应商（`409` 该供应商已产生采购单记录，`404` 供应商不存在）

---

## 采购 procurement

权限：超级管理员

- GET `/procurement?page=1&pageSize=100&search=&status=` — 采购单列表
- POST `/procurement` — 创建采购单（`400` 药品/供应商不存在，`409` 采购单号已存在）
- GET `/procurement/:id` — 采购单详情（`404` 采购单不存在）
- PUT `/procurement/:id` — 更新采购单
- POST `/procurement/:id/approve` — 审核采购单（`400` 只有待审核状态可审核，使用事务+行级锁保证数据一致性）
- DELETE `/procurement/:id` — 删除采购单（`404` 采购单不存在）

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

---

## 销售 sales

权限：所有登录用户

- GET `/sales?page=1&pageSize=100&search=&status=` — 销售单列表
- POST `/sales` — 创建销售单（`400` 药品不存在，`409` 销售单号已存在）
- GET `/sales/:id` — 销售单详情（`404` 销售单不存在）
- PUT `/sales/:id` — 更新销售单
- POST `/sales/:id/approve` — 确认销售单（`400` 只有待确认状态可确认 / 库存不足无法完成销售，使用事务+行级锁保证数据一致性）
- DELETE `/sales/:id` — 删除销售单（`404` 销售单不存在）

---

## 统计 stats

权限：超级管理员

- GET `/stats`

返回：

| 字段 | 说明 |
|------|------|
| medicinesTotal | 药品总数 |
| procurementMonthTotal | 本月采购总额 |
| procurementLastMonth | 上月采购总额 |
| salesMonthTotal | 本月销售总额 |
| salesLastMonth | 上月销售总额 |
| stockWarningTotal | 库存预警数量（预警状态药品数） |
| alerts | 预警/不足药品列表（最多 50 条） |
| recentSales | 最近 10 条销售记录 |
| dailySales | 近 7 天每日销售额 |

注意：`/stats` 接口结果有 1 分钟内存缓存，重复请求不会重复查询数据库。
