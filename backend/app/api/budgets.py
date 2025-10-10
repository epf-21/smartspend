from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, and_
from uuid import UUID
from app.models import Budget, Category, User
from app.schemas import BudgetCreate, BudgetResponse, BudgetUpdate
from app.database import get_db_session
from app.security import get_current_user

router = APIRouter(tags=["category"])


@router.post(
    "/budgets", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED
)
def create_budget(
    budget: BudgetCreate,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    category = session.get(Category, budget.category_id)

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )

    if category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to use this category",
        )
    existing_budget = session.exec(
        select(Budget)
        .join(Category)
        .where(
            and_(
                Budget.category_id == budget.category_id,
                Budget.period == budget.period,
                Budget.is_active,
                category.user_id == current_user.id,
            )
        )
    ).first()
    if existing_budget:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Active budget already exists for this category and period",
        )

    db_budget = Budget(**budget.model_dump())
    session.add(db_budget)
    session.commit()
    session.refresh(db_budget)
    return db_budget


@router.get("/budgets", response_model=list[BudgetResponse])
def get_budgets(
    skip: int = 0,
    limit: int = 20,
    is_active: bool | None = None,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):

    query = select(Budget).join(Category).where(Category.user_id == current_user.id)
    if is_active is not None:
        query = query.where(Budget.is_active == is_active)

    budgets = session.exec(query.offset(skip).limit(limit)).all()
    return budgets


@router.get("/budgets/{budget_id}", response_model=BudgetResponse)
def get_budget(
    budget_id: UUID,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    budget = session.get(Budget, budget_id)
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    category = session.get(Category, budget.category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this budget",
        )
    return budget


@router.put("/budgets/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: UUID,
    budget_update: BudgetUpdate,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):

    budget = session.get(Budget, budget_id)
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )
    category = session.get(Category, budget.category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this budget",
        )

    if budget_update.category_id and budget_update.category_id != budget.category_id:
        new_category = session.get(Category, budget_update.category_id)
        if not new_category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )
        if new_category.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to use this category",
            )

    budget_data = budget_update.model_dump(exclude_unset=True)
    for key, value in budget_data.items():
        setattr(budget, key, value)

    session.add(budget)
    session.commit()
    session.refresh(budget)
    return budget


@router.delete("/budgets/{budget_id}")
def delete_budget(
    budget_id: UUID,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    budget = session.get(Budget, budget_id)
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found"
        )
    category = session.get(Category, budget.category_id)

    if not category or category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to deteled this budget",
        )
    session.delete(budget)
    session.commit()
    return {"message": "Budget deleted successfully"}


@router.get("/budgets/category/{category_id}", response_model=list[BudgetResponse])
def budgets_by_category(
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
    budgets = session.exec(select(Budget).where(Budget.category_id == category_id)).all
    return budgets
