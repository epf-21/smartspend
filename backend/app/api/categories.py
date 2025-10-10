from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_db_session
from app.models import Category, User
from app.schemas import CategoryCreate, CategoryUpdate, CategoryResponse
from app.security import get_current_user

router = APIRouter(tags=["category"])


@router.post(
    "/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED
)
def create_category(
    category: CategoryCreate,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    existing_category = session.exec(
        select(Category).where(
            Category.name == category.name, Category.user_id == current_user.id
        )
    ).first()
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists"
        )

    db_category = Category(**category.model_dump(), user_id=current_user.id)
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category


@router.get("/categories", response_model=list[CategoryResponse])
def get_categories(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
):
    categories = session.exec(
        select(Category)
        .where(Category.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    ).all()
    return categories


@router.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category(
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
    return category


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: UUID,
    category_update: CategoryUpdate,
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

    if category_update.name != category.name:
        existing_category = session.exec(
            select(Category).where(
                category.name == category_update.name, category.id != category_id
            )
        ).first()
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category name already exists for this user",
            )
    category_data = category_update.model_dump(exclude_unset=True)
    for key, value in category_data.items():
        setattr(category, key, value)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.delete("/categories/{category_id}")
def delete_category(
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
    try:
        session.delete(category)
        session.commit()
        return {"message": "Category deleted successfully"}
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An unexpected error occurred while deleting the category",
        )
