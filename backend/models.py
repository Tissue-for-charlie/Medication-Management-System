from sqlalchemy import Column, Integer, String, DateTime, Numeric, Text
from sqlalchemy.sql import func
from .database import Base


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)  # 药品名称
    type = Column(String(100), nullable=False)  # 药品类型
    manufacturer = Column(String(255), nullable=False)  # 生产厂商
    batch_number = Column(String(100), nullable=False)  # 批号
    expiry_date = Column(DateTime, nullable=False)  # 有效期
    unit_price = Column(Numeric(10, 2), nullable=False)  # 单价
    description = Column(Text, nullable=True)  # 描述
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # 创建时间
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # 更新时间

    def __repr__(self):
        return f"<Medication(id={self.id}, name='{self.name}', type='{self.type}')>"