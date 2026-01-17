from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from decimal import Decimal


class MedicationBase(BaseModel):
    name: str
    type: str
    manufacturer: str
    batch_number: str
    expiry_date: datetime
    unit_price: Decimal
    description: Optional[str] = None


class MedicationCreate(MedicationBase):
    pass


class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    manufacturer: Optional[str] = None
    batch_number: Optional[str] = None
    expiry_date: Optional[datetime] = None
    unit_price: Optional[Decimal] = None
    description: Optional[str] = None


class Medication(MedicationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True