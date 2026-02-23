from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    username: str
    role: str = "user"
    contact: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    contact: Optional[str] = None


class User(UserBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class CategoryBase(BaseModel):
    name: str
    parent_id: Optional[int] = None
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None
    description: Optional[str] = None


class Category(CategoryBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class MedicationBase(BaseModel):
    name: str
    category_id: Optional[int] = None
    specification: Optional[str] = None
    unit_price: Decimal
    stock_quantity: int = 0
    min_stock_level: int = 10
    description: Optional[str] = None


class MedicationCreate(MedicationBase):
    pass


class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    specification: Optional[str] = None
    unit_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    min_stock_level: Optional[int] = None
    description: Optional[str] = None


class Medication(MedicationBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class Supplier(SupplierBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class PurchaseBase(BaseModel):
    medication_id: int
    supplier_id: int
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    purchase_date: date
    status: str = "pending"
    notes: Optional[str] = None


class PurchaseCreate(PurchaseBase):
    pass


class PurchaseUpdate(BaseModel):
    medication_id: Optional[int] = None
    supplier_id: Optional[int] = None
    quantity: Optional[int] = None
    unit_price: Optional[Decimal] = None
    total_price: Optional[Decimal] = None
    purchase_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class Purchase(PurchaseBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class SaleBase(BaseModel):
    medication_id: int
    customer_name: str
    quantity: int
    unit_price: Decimal
    total_price: Decimal
    sale_date: date
    payment_method: str = "cash"
    notes: Optional[str] = None


class SaleCreate(SaleBase):
    pass


class SaleUpdate(BaseModel):
    medication_id: Optional[int] = None
    customer_name: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[Decimal] = None
    total_price: Optional[Decimal] = None
    sale_date: Optional[date] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class Sale(SaleBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class ReturnBase(BaseModel):
    sale_id: int
    medication_id: int
    quantity: int
    reason: Optional[str] = None
    return_date: date
    status: str = "pending"
    notes: Optional[str] = None


class ReturnCreate(ReturnBase):
    pass


class ReturnUpdate(BaseModel):
    sale_id: Optional[int] = None
    medication_id: Optional[int] = None
    quantity: Optional[int] = None
    reason: Optional[str] = None
    return_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class Return(ReturnBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class PrescriptionBase(BaseModel):
    patient_name: str
    medication_id: int
    dosage: str
    quantity: int
    prescribed_date: date
    notes: Optional[str] = None


class PrescriptionCreate(PrescriptionBase):
    pass


class PrescriptionUpdate(BaseModel):
    patient_name: Optional[str] = None
    medication_id: Optional[int] = None
    dosage: Optional[str] = None
    quantity: Optional[int] = None
    prescribed_date: Optional[date] = None
    notes: Optional[str] = None


class Prescription(PrescriptionBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
