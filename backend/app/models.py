from enum import Enum
from sqlmodel import Column, DateTime, Relationship, SQLModel, Field
import sqlalchemy.dialects.postgresql as pg
from datetime import datetime, timezone
from uuid import UUID, uuid4
from typing import List


class CurrencyEnum(str, Enum):
    USD = "USD"
    EUR = "EUR"
    MXN = "MXN"
    COP = "COP"
    ARS = "ARS"
    BOB = "BOB"


class PaymentMethodEnum(str, Enum):
    CASH = "cash"
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    TRANSFER = "transfer"
    OTHER = "other"


class BudgetPeriodEnum(str, Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


class User(SQLModel, table=True):
    id: UUID = Field(
        sa_column=Column(pg.UUID, primary_key=True, unique=True, default=uuid4)
    )
    email: str = Field(index=True, unique=True)
    hashed_password: str
    full_name: str
    currency: CurrencyEnum = Field(default=CurrencyEnum.BOB)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            default=lambda: datetime.now(timezone.utc),
            onupdate=lambda: datetime.now(timezone.utc),
        )
    )
    transactions: List["Transaction"] = Relationship(
        back_populates="user", cascade_delete=True
    )
    categories: List["Category"] = Relationship(
        back_populates="user", cascade_delete=True
    )


class Category(SQLModel, table=True):
    id: UUID = Field(
        sa_column=Column(pg.UUID, primary_key=True, unique=True, default=uuid4)
    )
    name: str
    color: str = Field(default="#6366F1")
    icon: str = Field(default="")
    user_id: UUID | None = Field(default=None, foreign_key="user.id")

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            default=lambda: datetime.now(timezone.utc),
            onupdate=lambda: datetime.now(timezone.utc),
        )
    )
    user: User | None = Relationship(back_populates="categories")
    transactions: List["Transaction"] = Relationship(
        back_populates="category", cascade_delete=True
    )
    budgets: List["Budget"] = Relationship(
        back_populates="category", cascade_delete=True
    )


class Transaction(SQLModel, table=True):
    id: UUID = Field(
        sa_column=Column(pg.UUID, primary_key=True, unique=True, default=uuid4)
    )
    amount: float
    description: str
    date: datetime
    payment_method: PaymentMethodEnum = Field(default=PaymentMethodEnum.OTHER)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            default=lambda: datetime.now(timezone.utc),
            onupdate=lambda: datetime.now(timezone.utc),
        )
    )
    category_id: UUID = Field(foreign_key="category.id")
    user_id: UUID | None = Field(default=None, foreign_key="user.id")

    category: Category = Relationship(back_populates="transactions")
    user: User | None = Relationship(back_populates="transactions")


class Budget(SQLModel, table=True):
    id: UUID = Field(
        sa_column=Column(pg.UUID, primary_key=True, unique=True, default=uuid4)
    )
    amount: float
    period: BudgetPeriodEnum = Field(default=BudgetPeriodEnum.MONTHLY)
    start_date: datetime
    end_date: datetime | None = Field(default=None)
    is_active: bool = Field(default=True)
    category_id: UUID = Field(foreign_key="category.id")
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            default=lambda: datetime.now(timezone.utc),
            onupdate=lambda: datetime.now(timezone.utc),
        )
    )
    category: Category = Relationship(back_populates="budgets")
