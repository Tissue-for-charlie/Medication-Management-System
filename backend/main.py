from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="药物管理系统 API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "药物管理系统 API 正在运行"}


@app.get("/api/inventory")
def get_inventory(db: Session = Depends(get_db)):
    low_stock = db.query(models.Medication).filter(models.Medication.stock_quantity <= models.Medication.min_stock_level).all()
    total_items = db.query(func.count(models.Medication.id)).scalar() or 0
    total_stock = db.query(func.coalesce(func.sum(models.Medication.stock_quantity), 0)).scalar() or 0
    return {
        "total_items": total_items,
        "total_stock": int(total_stock),
        "low_stock_items": [
            {
                "id": item.id,
                "name": item.name,
                "stock_quantity": item.stock_quantity,
                "min_stock_level": item.min_stock_level,
            }
            for item in low_stock
        ],
    }


def _handle_delete(delete_fn, db: Session, item_id: int, not_found_detail: str):
    try:
        deleted = delete_fn(db, item_id)
    except crud.DeleteConflictError:
        raise HTTPException(status_code=409, detail="删除失败：记录仍被其他数据引用")
    if not deleted:
        raise HTTPException(status_code=404, detail=not_found_detail)
    return {"message": "删除成功"}


# Users
@app.post("/api/users", response_model=schemas.User)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, payload)


@app.get("/api/users", response_model=list[schemas.User])
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_users(db, skip, limit)


@app.get("/api/users/{item_id}", response_model=schemas.User)
def get_user(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_user(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="用户未找到")
    return item


@app.put("/api/users/{item_id}", response_model=schemas.User)
def update_user(item_id: int, payload: schemas.UserUpdate, db: Session = Depends(get_db)):
    item = crud.update_user(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="用户未找到")
    return item


@app.delete("/api/users/{item_id}")
def delete_user(item_id: int, db: Session = Depends(get_db)):
    return _handle_delete(crud.delete_user, db, item_id, "用户未找到")


# Categories
@app.post("/api/categories", response_model=schemas.Category)
def create_category(payload: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db, payload)


@app.get("/api/categories", response_model=list[schemas.Category])
def list_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_categories(db, skip, limit)


@app.get("/api/categories/{item_id}", response_model=schemas.Category)
def get_category(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_category(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="分类未找到")
    return item


@app.put("/api/categories/{item_id}", response_model=schemas.Category)
def update_category(item_id: int, payload: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    item = crud.update_category(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="分类未找到")
    return item


@app.delete("/api/categories/{item_id}")
def delete_category(item_id: int, db: Session = Depends(get_db)):
    return _handle_delete(crud.delete_category, db, item_id, "分类未找到")


# Medications
@app.post("/api/medications", response_model=schemas.Medication)
def create_medication(payload: schemas.MedicationCreate, db: Session = Depends(get_db)):
    return crud.create_medication(db, payload)


@app.get("/api/medications", response_model=list[schemas.Medication])
def list_medications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_medications(db, skip, limit)


@app.get("/api/medications/{item_id}", response_model=schemas.Medication)
def get_medication(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_medication(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="药品未找到")
    return item


@app.put("/api/medications/{item_id}", response_model=schemas.Medication)
def update_medication(item_id: int, payload: schemas.MedicationUpdate, db: Session = Depends(get_db)):
    item = crud.update_medication(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="药品未找到")
    return item


@app.delete("/api/medications/{item_id}")
def delete_medication(item_id: int, db: Session = Depends(get_db)):
    return _handle_delete(crud.delete_medication, db, item_id, "药品未找到")


# Suppliers
@app.post("/api/suppliers", response_model=schemas.Supplier)
def create_supplier(payload: schemas.SupplierCreate, db: Session = Depends(get_db)):
    return crud.create_supplier(db, payload)


@app.get("/api/suppliers", response_model=list[schemas.Supplier])
def list_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_suppliers(db, skip, limit)


@app.get("/api/suppliers/{item_id}", response_model=schemas.Supplier)
def get_supplier(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_supplier(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="供应商未找到")
    return item


@app.put("/api/suppliers/{item_id}", response_model=schemas.Supplier)
def update_supplier(item_id: int, payload: schemas.SupplierUpdate, db: Session = Depends(get_db)):
    item = crud.update_supplier(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="供应商未找到")
    return item


@app.delete("/api/suppliers/{item_id}")
def delete_supplier(item_id: int, db: Session = Depends(get_db)):
    return _handle_delete(crud.delete_supplier, db, item_id, "供应商未找到")


# Purchases
@app.post("/api/purchases", response_model=schemas.Purchase)
def create_purchase(payload: schemas.PurchaseCreate, db: Session = Depends(get_db)):
    return crud.create_purchase(db, payload)


@app.get("/api/purchases", response_model=list[schemas.Purchase])
def list_purchases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_purchases(db, skip, limit)


@app.get("/api/purchases/{item_id}", response_model=schemas.Purchase)
def get_purchase(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_purchase(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="采购记录未找到")
    return item


@app.put("/api/purchases/{item_id}", response_model=schemas.Purchase)
def update_purchase(item_id: int, payload: schemas.PurchaseUpdate, db: Session = Depends(get_db)):
    item = crud.update_purchase(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="采购记录未找到")
    return item


@app.delete("/api/purchases/{item_id}")
def delete_purchase(item_id: int, db: Session = Depends(get_db)):
    return _handle_delete(crud.delete_purchase, db, item_id, "采购记录未找到")


# Sales
@app.post("/api/sales", response_model=schemas.Sale)
def create_sale(payload: schemas.SaleCreate, db: Session = Depends(get_db)):
    return crud.create_sale(db, payload)


@app.get("/api/sales", response_model=list[schemas.Sale])
def list_sales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_sales(db, skip, limit)


@app.get("/api/sales/{item_id}", response_model=schemas.Sale)
def get_sale(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_sale(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="销售记录未找到")
    return item


@app.put("/api/sales/{item_id}", response_model=schemas.Sale)
def update_sale(item_id: int, payload: schemas.SaleUpdate, db: Session = Depends(get_db)):
    item = crud.update_sale(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="销售记录未找到")
    return item


@app.delete("/api/sales/{item_id}")
def delete_sale(item_id: int, db: Session = Depends(get_db)):
    return _handle_delete(crud.delete_sale, db, item_id, "销售记录未找到")


# Returns
@app.post("/api/returns", response_model=schemas.Return)
def create_return(payload: schemas.ReturnCreate, db: Session = Depends(get_db)):
    return crud.create_return(db, payload)


@app.get("/api/returns", response_model=list[schemas.Return])
def list_returns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_returns(db, skip, limit)


@app.get("/api/returns/{item_id}", response_model=schemas.Return)
def get_return(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_return(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="退货记录未找到")
    return item


@app.put("/api/returns/{item_id}", response_model=schemas.Return)
def update_return(item_id: int, payload: schemas.ReturnUpdate, db: Session = Depends(get_db)):
    item = crud.update_return(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="退货记录未找到")
    return item


@app.delete("/api/returns/{item_id}")
def delete_return(item_id: int, db: Session = Depends(get_db)):
    return _handle_delete(crud.delete_return, db, item_id, "退货记录未找到")


# Prescriptions
@app.post("/api/prescriptions", response_model=schemas.Prescription)
def create_prescription(payload: schemas.PrescriptionCreate, db: Session = Depends(get_db)):
    return crud.create_prescription(db, payload)


@app.get("/api/prescriptions", response_model=list[schemas.Prescription])
def list_prescriptions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.list_prescriptions(db, skip, limit)


@app.get("/api/prescriptions/{item_id}", response_model=schemas.Prescription)
def get_prescription(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_prescription(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="处方未找到")
    return item


@app.put("/api/prescriptions/{item_id}", response_model=schemas.Prescription)
def update_prescription(item_id: int, payload: schemas.PrescriptionUpdate, db: Session = Depends(get_db)):
    item = crud.update_prescription(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="处方未找到")
    return item


@app.delete("/api/prescriptions/{item_id}")
def delete_prescription(item_id: int, db: Session = Depends(get_db)):
    return _handle_delete(crud.delete_prescription, db, item_id, "处方未找到")
