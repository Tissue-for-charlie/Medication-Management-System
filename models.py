from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from database import engine, get_db, Base
from schemas import SupplierCreate, SupplierUpdate, SupplierResponse, PaginatedResponse
from crud import (
    get_suppliers,
    get_supplier_by_id,
    create_supplier,
    update_supplier,
    delete_supplier,
    batch_delete_suppliers
)

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="供应商管理API")

# 跨域配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 分页查询供应商
@app.get("/api/suppliers", response_model=PaginatedResponse, summary="分页查询供应商")
def read_suppliers(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=100, description="每页条数"),
    search: str = Query("", description="搜索关键词（供应商名）"),
    db: Session = Depends(get_db)
):
    return get_suppliers(db, page, page_size, search)

# 新增供应商
@app.post("/api/suppliers", response_model=SupplierResponse, summary="新增供应商")
def create_supplier_api(supplier: SupplierCreate, db: Session = Depends(get_db)):
    return create_supplier(db, supplier)

# 更新供应商
@app.put("/api/suppliers/{supplier_id}", response_model=SupplierResponse, summary="更新供应商")
def update_supplier_api(supplier_id: int, supplier: SupplierUpdate, db: Session = Depends(get_db)):
    db_supplier = update_supplier(db, supplier_id, supplier)
    if not db_supplier:
        raise HTTPException(status_code=404, detail="供应商不存在")
    return db_supplier

# 删除供应商
@app.delete("/api/suppliers/{supplier_id}", summary="删除供应商")
def delete_supplier_api(supplier_id: int, db: Session = Depends(get_db)):
    db_supplier = delete_supplier(db, supplier_id)
    if not db_supplier:
        raise HTTPException(status_code=404, detail="供应商不存在")
    return {"message": "删除成功"}

# 批量删除供应商
@app.delete("/api/suppliers/batch", summary="批量删除供应商")
def batch_delete_suppliers_api(ids: List[int], db: Session = Depends(get_db)):
    deleted_count = batch_delete_suppliers(db, ids)
    return {"message": f"成功删除 {deleted_count} 条数据"}