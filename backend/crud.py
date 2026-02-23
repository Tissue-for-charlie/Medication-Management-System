from typing import Type

from sqlalchemy.orm import Session

from . import models


def _get(db: Session, model: Type, item_id: int):
    return db.query(model).filter(model.id == item_id).first()


def _list(db: Session, model: Type, skip: int = 0, limit: int = 100):
    return db.query(model).offset(skip).limit(limit).all()


def _create(db: Session, model: Type, payload):
    item = model(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def _update(db: Session, model: Type, item_id: int, payload):
    item = _get(db, model, item_id)
    if not item:
        return None
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def _delete(db: Session, model: Type, item_id: int):
    item = _get(db, model, item_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True


get_user = lambda db, item_id: _get(db, models.User, item_id)
list_users = lambda db, skip=0, limit=100: _list(db, models.User, skip, limit)
create_user = lambda db, payload: _create(db, models.User, payload)
update_user = lambda db, item_id, payload: _update(db, models.User, item_id, payload)
delete_user = lambda db, item_id: _delete(db, models.User, item_id)

get_category = lambda db, item_id: _get(db, models.Category, item_id)
list_categories = lambda db, skip=0, limit=100: _list(db, models.Category, skip, limit)
create_category = lambda db, payload: _create(db, models.Category, payload)
update_category = lambda db, item_id, payload: _update(db, models.Category, item_id, payload)
delete_category = lambda db, item_id: _delete(db, models.Category, item_id)

get_medication = lambda db, item_id: _get(db, models.Medication, item_id)
list_medications = lambda db, skip=0, limit=100: _list(db, models.Medication, skip, limit)
create_medication = lambda db, payload: _create(db, models.Medication, payload)
update_medication = lambda db, item_id, payload: _update(db, models.Medication, item_id, payload)
delete_medication = lambda db, item_id: _delete(db, models.Medication, item_id)

get_supplier = lambda db, item_id: _get(db, models.Supplier, item_id)
list_suppliers = lambda db, skip=0, limit=100: _list(db, models.Supplier, skip, limit)
create_supplier = lambda db, payload: _create(db, models.Supplier, payload)
update_supplier = lambda db, item_id, payload: _update(db, models.Supplier, item_id, payload)
delete_supplier = lambda db, item_id: _delete(db, models.Supplier, item_id)

get_purchase = lambda db, item_id: _get(db, models.Purchase, item_id)
list_purchases = lambda db, skip=0, limit=100: _list(db, models.Purchase, skip, limit)
create_purchase = lambda db, payload: _create(db, models.Purchase, payload)
update_purchase = lambda db, item_id, payload: _update(db, models.Purchase, item_id, payload)
delete_purchase = lambda db, item_id: _delete(db, models.Purchase, item_id)

get_sale = lambda db, item_id: _get(db, models.Sale, item_id)
list_sales = lambda db, skip=0, limit=100: _list(db, models.Sale, skip, limit)
create_sale = lambda db, payload: _create(db, models.Sale, payload)
update_sale = lambda db, item_id, payload: _update(db, models.Sale, item_id, payload)
delete_sale = lambda db, item_id: _delete(db, models.Sale, item_id)

get_return = lambda db, item_id: _get(db, models.Return, item_id)
list_returns = lambda db, skip=0, limit=100: _list(db, models.Return, skip, limit)
create_return = lambda db, payload: _create(db, models.Return, payload)
update_return = lambda db, item_id, payload: _update(db, models.Return, item_id, payload)
delete_return = lambda db, item_id: _delete(db, models.Return, item_id)

get_prescription = lambda db, item_id: _get(db, models.Prescription, item_id)
list_prescriptions = lambda db, skip=0, limit=100: _list(db, models.Prescription, skip, limit)
create_prescription = lambda db, payload: _create(db, models.Prescription, payload)
update_prescription = lambda db, item_id, payload: _update(db, models.Prescription, item_id, payload)
delete_prescription = lambda db, item_id: _delete(db, models.Prescription, item_id)
