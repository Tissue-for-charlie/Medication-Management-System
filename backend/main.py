from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base
from . import crud, models, schemas

# 创建所有表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="药物管理系统 API", version="1.0.0")

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该限制为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "药物管理系统 API"}


# 药品类别相关路由
@app.post("/api/medications/", response_model=schemas.Medication)
def create_medication(medication: schemas.MedicationCreate, db: Session = Depends(crud.get_db)):
    return crud.create_medication(db=db, medication=medication)


@app.get("/api/medications/", response_model=list[schemas.Medication])
def read_medications(skip: int = 0, limit: int = 100, db: Session = Depends(crud.get_db)):
    medications = crud.get_medications(db, skip=skip, limit=limit)
    return medications


@app.get("/api/medications/{medication_id}", response_model=schemas.Medication)
def read_medication(medication_id: int, db: Session = Depends(crud.get_db)):
    medication = crud.get_medication(db, medication_id=medication_id)
    if medication is None:
        raise HTTPException(status_code=404, detail="药品未找到")
    return medication


@app.put("/api/medications/{medication_id}", response_model=schemas.Medication)
def update_medication(
    medication_id: int, 
    medication: schemas.MedicationUpdate, 
    db: Session = Depends(crud.get_db)
):
    db_medication = crud.update_medication(db, medication_id=medication_id, medication=medication)
    if db_medication is None:
        raise HTTPException(status_code=404, detail="药品未找到")
    return db_medication


@app.delete("/api/medications/{medication_id}")
def delete_medication(medication_id: int, db: Session = Depends(crud.get_db)):
    result = crud.delete_medication(db, medication_id=medication_id)
    if not result:
        raise HTTPException(status_code=404, detail="药品未找到")
    return {"message": "药品删除成功"}