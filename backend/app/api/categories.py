from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_db_session
from app.models import Category
from app.schemas import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter()


@router.post(
    "/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED
)
def create_category(
    category: CategoryCreate,
    session: Session = Depends(get_db_session),
):
    existing_category = session.exec(
        select(Category).where(Category.name == category.name)
    ).first()
    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists"
        )

    db_category = Category(**category.model_dump())
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category


@router.get("/categories", response_model=list[CategoryResponse])
def get_categories(
    skip: int = 0, limit: int = 100, session: Session = Depends(get_db_session)
):
    categories = session.exec(select(Category).offset(skip).limit(limit)).all()
    return categories


@router.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category(category_id: UUID, session: Session = Depends(get_db_session)):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
        )
    return category


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: UUID,
    category_update: CategoryUpdate,
    session: Session = Depends(get_db_session),
):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
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
def delete_category(category_id: UUID, session: Session = Depends(get_db_session)):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
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
