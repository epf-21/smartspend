from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, col, func, select
from uuid import UUID
from datetime import datetime
from app.models import Transaction
from app.schemas import TransactionCreate, TransactionResponse
from app.database import get_db_session

router = APIRouter()


@router.post(
    "/transactions",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(
    transaction: TransactionCreate, session: Session = Depends(get_db_session)
):
    db_transaction = Transaction(**transaction.model_dump())
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


@router.get("/transactions", response_model=list[TransactionResponse])
def get_transactions(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_db_session)
):
    transactions = session.exec(select(Transaction).offset(skip).limit(limit)).all()
    return transactions


@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: UUID, session: Session = Depends(get_db_session)):
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="transaction not found"
        )
    return transaction


@router.get("/transactions/user/{user_id}", response_model=list[TransactionResponse])
def get_transactions_by_user(
    user_id: UUID,
    category_id: UUID | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    session: Session = Depends(get_db_session),
):
    query = select(Transaction).where(Transaction.user_id == user_id)
    if category_id:
        query = query.where(Transaction.category_id == category_id)
    if start_date:
        query = query.where(Transaction.date >= start_date)
    if start_date:
        query = query.where(col(Transaction.date) <= end_date)
    transactions = session.exec(query).all()
    return transactions


@router.get("/transactions/user/{user_id}/summary")
def get_transaction_summary(user_id: UUID, session: Session = Depends(get_db_session)):

    total_expenses = (
        session.exec(
            select(func.sum(Transaction.amount)).where(
                Transaction.user_id == user_id, Transaction.amount > 0
            )
        ).first()
        or 0
    )

    return {
        "total_expenses": abs(total_expenses),
    }


@router.get("/transactions/category/{category_id}/summary")
def get_transsaction_summary_by_category(
    category_id: UUID, session: Session = Depends(get_db_session)
):
    total_expenses = (
        session.exec(
            select(func.sum(Transaction.amount)).where(
                Transaction.category_id == category_id, Transaction.amount > 0
            )
        ).first()
        or 0
    )
    return {"total_expenses": abs(total_expenses)}
