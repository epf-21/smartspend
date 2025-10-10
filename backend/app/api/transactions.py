from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, col, func, select
from uuid import UUID
from datetime import datetime
from app.models import Category, Transaction, User
from app.schemas import TransactionCreate, TransactionResponse, TransactionUpdate
from app.database import get_db_session
from app.security import get_current_user

router = APIRouter(tags=["transaction"])


@router.post(
    "/transactions",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(
    transaction: TransactionCreate,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    category = session.get(Category, transaction.category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )

    if category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to user this category",
        )
    db_transaction = Transaction(**transaction.model_dump(), user_id=current_user.id)
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


@router.get("/transactions", response_model=list[TransactionResponse])
def get_transactions(
    skip: int = 0,
    limit: int = 10,
    category_id: UUID | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    query = select(Transaction).where(Transaction.user_id == current_user.id)

    if category_id:
        query = query.where(Transaction.category_id == category_id)
    if start_date:
        query = query.where(Transaction.date >= start_date)
    if end_date:
        query = query.where(Transaction.date <= end_date)

    query = query.order_by(col(Transaction.date).desc())
    transactions = session.exec(query.offset(skip).limit(limit)).all()
    return transactions


@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
def get_transaction(
    transaction_id: UUID,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="transaction not found"
        )
    if transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this transaction",
        )
    return transaction


@router.put("/transactions/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: UUID,
    transaction_update: TransactionUpdate,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )

    if transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this transation",
        )

    if (
        transaction_update.category_id
        and transaction_update.category_id != transaction.category_id
    ):
        new_category = session.get(Category, transaction_update.category_id)
        if not new_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
            )
        if new_category.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to use this category",
            )

    transaction_data = transaction_update.model_dump(exclude_unset=True)
    for key, value in transaction_data.items():
        setattr(transaction, key, value)
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction


@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: UUID,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    transaction = session.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )
    if transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this transaction",
        )
    session.delete(transaction)
    session.commit()
    return {"message": "Transaction deleted successfully"}


@router.get("/transactions/user/summary")
def get_my_transaction_summary(
    user_id: UUID,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):

    total_expenses = (
        session.exec(
            select(func.sum(Transaction.amount)).where(
                Transaction.user_id == current_user.id, Transaction.amount > 0
            )
        ).first()
        or 0
    )

    return {
        "total_expenses": abs(total_expenses),
    }


@router.get("/transactions/category/{category_id}/summary")
def get_transsaction_summary_by_category(
    category_id: UUID,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )
    if category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this category",
        )
    total_expenses = (
        session.exec(
            select(func.sum(Transaction.amount)).where(
                Transaction.category_id == category_id,
                Transaction.user_id == current_user.id,
                Transaction.amount > 0,
            )
        ).first()
        or 0
    )
    return {"total_expenses": abs(total_expenses)}


@router.get(
    "/transactions/category/{category_id}", response_model=list[TransactionResponse]
)
def get_transactions_by_category(
    category_id: UUID,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    category = session.get(Category, category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    if category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this category",
        )

    transactions = session.exec(
        select(Transaction)
        .where(
            Transaction.category_id == category_id,
            Transaction.user_id == current_user.id,
        )
        .order_by(col(Transaction.date).desc())
    ).all()
    return transactions
