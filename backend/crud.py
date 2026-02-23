from typing import Type

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from . import models


class CrudError(ValueError):
    """业务可预期错误，转换为 4xx。"""


def _get(db: Session, model: Type, item_id: int):
    return db.query(model).filter(model.id == item_id).first()


def _list(db: Session, model: Type, skip: int = 0, limit: int = 100):
    return db.query(model).offset(skip).limit(limit).all()


def _validate_references(db: Session, payload_data: dict):
    references = {
        "category_id": models.Category,
        "medication_id": models.Medication,
        "supplier_id": models.Supplier,
        "sale_id": models.Sale,
    }
    for field, ref_model in references.items():
        ref_id = payload_data.get(field)
        if ref_id is None:
            continue
        if _get(db, ref_model, ref_id) is None:
            raise CrudError(f"关联数据不存在: {field}={ref_id}")


def _create(db: Session, model: Type, payload):
    payload_data = payload.model_dump()
    _validate_references(db, payload_data)
    item = model(**payload_data)
    db.add(item)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise CrudError("数据约束冲突，请检查唯一键或外键") from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise CrudError("数据库写入失败") from exc
    db.refresh(item)
    return item


def _update(db: Session, model: Type, item_id: int, payload):
    item = _get(db, model, item_id)
    if not item:
        return None
    payload_data = payload.model_dump(exclude_unset=True)
    _validate_references(db, payload_data)
    for key, value in payload_data.items():
        setattr(item, key, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise CrudError("数据约束冲突，请检查唯一键或外键") from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise CrudError("数据库更新失败") from exc
    db.refresh(item)
    return item


def _delete(db: Session, model: Type, item_id: int):
    item = _get(db, model, item_id)
    if not item:
        return False
    db.delete(item)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise CrudError("该记录被其他数据引用，无法删除") from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise CrudError("数据库删除失败") from exc
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
