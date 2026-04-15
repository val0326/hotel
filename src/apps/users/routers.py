from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src import dependencies
from src.auth import get_current_active_user
from src.apps.users import models as user_models
from . import schemas, services

router = APIRouter()


@router.get("/me", response_model=schemas.User, tags=["users"])
def read_current_user(current_user: user_models.User = Depends(get_current_active_user)):
    """
    Получить текущего аутентифицированного пользователя.
    """
    return current_user


@router.post("/", response_model=schemas.UserWithToken, tags=["users"])
def create_user(user: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    db_user = services.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    created_user = services.create_user(db=db, user=user)
    # Создаём токен для автоматического входа
    access_token = create_access_token(data={"sub": str(created_user.id)})
    return {
        "id": created_user.id,
        "email": created_user.email,
        "is_active": created_user.is_active,
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/", response_model=list[schemas.User], tags=["users"])
def read_users(
    skip: int = 0, limit: int = 100, db: Session = Depends(dependencies.get_db)
):
    users = services.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=schemas.User, tags=["users"])
def read_user(user_id: int, db: Session = Depends(dependencies.get_db)):
    db_user = services.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return db_user


@router.patch("/{user_id}", response_model=schemas.User, tags=["users"])
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(dependencies.get_db),
):
    updated_user = services.update_user(db, user_id=user_id, update_data=user_update)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return updated_user


@router.delete("/{user_id}", tags=["users"])
def delete_user(user_id: int, db: Session = Depends(dependencies.get_db)):
    deleted_user = services.delete_user(db, user_id=user_id)
    if deleted_user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return {"message": f"Пользователь с id={user_id} успешно удалён"}
