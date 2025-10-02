from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta

from starlette.status import HTTP_401_UNAUTHORIZED
from app.database import get_db_session
from app.models import User
from app.schemas import (
    UserCreate,
    UserResponse,
    LoginRequest,
    Token,
)
from app.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)

router = APIRouter(tags=["auth"])


@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
)
def register(user_data: UserCreate, session: Session = Depends(get_db_session)):
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email alreadey registered",
        )

    user_dict = user_data.model_dump(exclude={"password"})
    hashed_password = get_password_hash(user_data.password)
    db_user = User(**user_dict, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expire_delta=access_token_expires
    )

    return {"access_token": access_token}


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, session: Session = Depends(get_db_session)):
    user = session.exec(select(User).where(User.email == login_data.email)).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Incorret email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expire_delta=access_token_expires
    )
    return {"access_token": access_token}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/refresh", response_model=Token)
def refresh_token(current_user: User = Depends(get_current_user)):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(current_user.id)}, expire_delta=access_token_expires
    )
    return {"access_token": access_token}


@router.delete("/delete")
def delete_users(session: Session = Depends(get_db_session)):
    users = session.exec(select(User)).all()
    for user in users:
        session.delete(user)
    session.commit()
    return {"message": f"Se eliminaron {len(users)} usuarios"}
