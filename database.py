from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from models import Supplier
from schemas import SupplierCreate, SupplierUpdate

# 分页查询供应商
def get_suppliers(db: Session, page: int = 1, page_size: int = 10, search: str = ""):
    skip = (page - 1) * page_size
    query = db.query(Supplier)
    # 模糊搜索（按供应商名）
    if search:
        query = query.filter(or_(Supplier.supplier_name.contains(search)))
    total = query.count()
    suppliers = query.offset(skip).limit(page_size).all()
    return {"total": total, "page": page, "page_size": page_size, "data": suppliers}

# 根据ID查询供应商
def get_supplier_by_id(db: Session, supplier_id: int):
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

# 新增供应商
def create_supplier(db: Session, supplier: SupplierCreate):
    db_supplier = Supplier(**supplier.dict())
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

# 更新供应商
def update_supplier(db: Session, supplier_id: int, supplier: SupplierUpdate):
    db_supplier = get_supplier_by_id(db, supplier_id)
    if not db_supplier:
        return None
    for key, value in supplier.dict().items():
        setattr(db_supplier, key, value)
    db.commit()
    db.refresh(db_supplier)
    return db_supplier

# 删除供应商
def delete_supplier(db: Session, supplier_id: int):
    db_supplier = get_supplier_by_id(db, supplier_id)
    if not db_supplier:
        return None
    db.delete(db_supplier)
    db.commit()
    return db_supplier

# 批量删除供应商
def batch_delete_suppliers(db: Session, ids: List[int]):
    deleted_count = 0
    for supplier_id in ids:
        supplier = get_supplier_by_id(db, supplier_id)
        if supplier:
            db.delete(supplier)
            deleted_count += 1
    db.commit()
    return deleted_count