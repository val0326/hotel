from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import dependencies
from . import schemas, services

router = APIRouter()


@router.post("/", response_model=schemas.User, tags=["users"])
def create_user(user: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    db_user = services.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    return services.create_user(db=db, user=user)


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
