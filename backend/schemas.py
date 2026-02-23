from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    role: str = "user"
    contact: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(min_length=6, max_length=255)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None, min_length=3, max_length=50)
    password: Optional[str] = Field(default=None, min_length=6, max_length=255)
    role: Optional[str] = None
    contact: Optional[str] = None


class User(UserBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    parent_id: Optional[int] = Field(default=None, ge=1)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    parent_id: Optional[int] = Field(default=None, ge=1)
    description: Optional[str] = None


class Category(CategoryBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class MedicationBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category_id: Optional[int] = Field(default=None, ge=1)
    specification: Optional[str] = None
    unit_price: Decimal = Field(gt=0)
    stock_quantity: int = Field(default=0, ge=0)
    min_stock_level: int = Field(default=10, ge=0)
    description: Optional[str] = None


class MedicationCreate(MedicationBase):
    pass


class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = Field(default=None, ge=1)
    specification: Optional[str] = None
    unit_price: Optional[Decimal] = Field(default=None, gt=0)
    stock_quantity: Optional[int] = Field(default=None, ge=0)
    min_stock_level: Optional[int] = Field(default=None, ge=0)
    description: Optional[str] = None


class Medication(MedicationBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class SupplierBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    contact_person: Optional[str] = Field(default=None, max_length=50)
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    contact_person: Optional[str] = Field(default=None, max_length=50)
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class Supplier(SupplierBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class PurchaseBase(BaseModel):
    medication_id: int = Field(ge=1)
    supplier_id: int = Field(ge=1)
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(gt=0)
    total_price: Decimal = Field(gt=0)
    purchase_date: date
    status: str = "pending"
    notes: Optional[str] = None


class PurchaseCreate(PurchaseBase):
    pass


class PurchaseUpdate(BaseModel):
    medication_id: Optional[int] = Field(default=None, ge=1)
    supplier_id: Optional[int] = Field(default=None, ge=1)
    quantity: Optional[int] = Field(default=None, gt=0)
    unit_price: Optional[Decimal] = Field(default=None, gt=0)
    total_price: Optional[Decimal] = Field(default=None, gt=0)
    purchase_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class Purchase(PurchaseBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class SaleBase(BaseModel):
    medication_id: int = Field(ge=1)
    customer_name: str = Field(min_length=1, max_length=100)
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(gt=0)
    total_price: Decimal = Field(gt=0)
    sale_date: date
    payment_method: str = "cash"
    notes: Optional[str] = None


class SaleCreate(SaleBase):
    pass


class SaleUpdate(BaseModel):
    medication_id: Optional[int] = Field(default=None, ge=1)
    customer_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    quantity: Optional[int] = Field(default=None, gt=0)
    unit_price: Optional[Decimal] = Field(default=None, gt=0)
    total_price: Optional[Decimal] = Field(default=None, gt=0)
    sale_date: Optional[date] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class Sale(SaleBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class ReturnBase(BaseModel):
    sale_id: int = Field(ge=1)
    medication_id: int = Field(ge=1)
    quantity: int = Field(gt=0)
    reason: Optional[str] = None
    return_date: date
    status: str = "pending"
    notes: Optional[str] = None


class ReturnCreate(ReturnBase):
    pass


class ReturnUpdate(BaseModel):
    sale_id: Optional[int] = Field(default=None, ge=1)
    medication_id: Optional[int] = Field(default=None, ge=1)
    quantity: Optional[int] = Field(default=None, gt=0)
    reason: Optional[str] = None
    return_date: Optional[date] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class Return(ReturnBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class PrescriptionBase(BaseModel):
    patient_name: str = Field(min_length=1, max_length=100)
    medication_id: int = Field(ge=1)
    dosage: str = Field(min_length=1, max_length=100)
    quantity: int = Field(gt=0)
    prescribed_date: date
    notes: Optional[str] = None


class PrescriptionCreate(PrescriptionBase):
    pass


class PrescriptionUpdate(BaseModel):
    patient_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    medication_id: Optional[int] = Field(default=None, ge=1)
    dosage: Optional[str] = Field(default=None, min_length=1, max_length=100)
    quantity: Optional[int] = Field(default=None, gt=0)
    prescribed_date: Optional[date] = None
    notes: Optional[str] = None


class Prescription(PrescriptionBase, ORMModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
