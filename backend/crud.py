from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from . import models, schemas


def get_medication(db: Session, medication_id: int):
    return db.query(models.Medication).filter(models.Medication.id == medication_id).first()


def get_medications(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Medication).offset(skip).limit(limit).all()


def create_medication(db: Session, medication: schemas.MedicationCreate):
    db_medication = models.Medication(**medication.dict())
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication


def update_medication(db: Session, medication_id: int, medication: schemas.MedicationUpdate):
    db_medication = get_medication(db, medication_id)
    if db_medication:
        for key, value in medication.dict(exclude_unset=True).items():
            setattr(db_medication, key, value)
        db.commit()
        db.refresh(db_medication)
    return db_medication


def delete_medication(db: Session, medication_id: int):
    db_medication = get_medication(db, medication_id)
    if db_medication:
        db.delete(db_medication)
        db.commit()
        return True
    return False


# 数据库会话依赖
def get_db():
    from .database import SessionLocal
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()