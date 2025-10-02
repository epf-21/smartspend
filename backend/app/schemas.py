from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models import BudgetPeriodEnum, CurrencyEnum, PaymentMethodEnum


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    currency: CurrencyEnum = CurrencyEnum.BOB


class UserCreate(UserBase):
    password: str = Field(
        ..., min_length=6, description="Password must be at least 6 characters"
    )

    @field_validator("password")
    def password_length(cls, v):
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password to long (max 72 bytes)")
        return v


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    full_name: str | None = None
    currency: CurrencyEnum | None = None
    password: str | None = Field(
        None, min_length=6, description="Password must be at least 6 characters"
    )


class UserResponse(UserBase):
    id: UUID

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    color: str = Field(default="#6366F1", pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
    icon: str = Field(default="", max_length=20)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    color: str | None = Field(None, pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
    icon: str | None = Field(None, max_length=20)


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    color: str
    icon: str
    user_id: UUID | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TransactionBase(BaseModel):
    amount: float = Field(
        ...,
        description="Transaction amount (positive for income, negative for expense)",
    )
    description: str = Field(..., min_length=1, max_length=200)
    date: datetime
    payment_method: PaymentMethodEnum = PaymentMethodEnum.OTHER


class TransactionCreate(TransactionBase):
    category_id: UUID


class TransactionUpdate(BaseModel):
    amount: float | None = None
    description: str | None = Field(None, min_length=1, max_length=200)
    date: datetime | None = None
    payment_method: PaymentMethodEnum | None = None
    category_id: UUID | None = None


class TransactionResponse(BaseModel):
    id: UUID
    amount: float
    description: str
    date: datetime
    payment_method: PaymentMethodEnum
    category_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BudgetBase(BaseModel):
    amount: float = Field(..., gt=0, description="Budget amount must be greater than 0")
    period: BudgetPeriodEnum = BudgetPeriodEnum.MONTHLY
    start_date: datetime
    end_date: datetime | None = None
    is_active: bool = True


class BudgetCreate(BudgetBase):
    category_id: UUID


class BudgetUpdate(BaseModel):
    amount: float | None = Field(None, gt=0)
    period: BudgetPeriodEnum | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    is_active: bool | None = None
    category_id: UUID | None = None


class BudgetResponse(BaseModel):
    id: UUID
    amount: float
    period: BudgetPeriodEnum
    start_date: datetime
    end_date: datetime | None
    is_active: bool
    category_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
