from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from src import dependencies
from src.auth import get_current_active_user
from src.apps.users import models as user_models
from . import schemas, services
from .models import BookingStatus

router = APIRouter()


@router.post("/", response_model=schemas.Booking, tags=["bookings"])
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(dependencies.get_db),
    current_user: user_models.User = Depends(get_current_active_user),
):
    """
    Создать бронирование.
    Требуется аутентификация. Пользователь может бронировать только от своего имени.
    """
    # Убедимся, что пользователь бронирует от своего имени
    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Нельзя бронировать от имени другого пользователя"
        )
    try:
        return services.create_booking(db=db, booking=booking)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[schemas.Booking], tags=["bookings"])
def read_bookings(
    skip: int = 0,
    limit: int = 100,
    user_id: int | None = None,
    status: BookingStatus | None = None,
    db: Session = Depends(dependencies.get_db),
    current_user: user_models.User = Depends(get_current_active_user),
):
    """
    Получить список бронирований.
    Обычные пользователи видят только свои бронирования.
    """
    # Если не указан user_id, подставляем текущего пользователя
    filter_user_id = user_id if user_id else current_user.id
    
    # Обычные пользователи могут видеть только свои бронирования
    if filter_user_id != current_user.id:
        # Здесь можно добавить проверку на админа, пока все видят только свои
        filter_user_id = current_user.id
    
    bookings = services.get_bookings(
        db, skip=skip, limit=limit, user_id=filter_user_id, status=status
    )
    return bookings


@router.get("/{booking_id}", response_model=schemas.Booking, tags=["bookings"])
def read_booking(
    booking_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: user_models.User = Depends(get_current_active_user),
):
    """
    Получить бронирование по ID.
    Пользователь может видеть только свои бронирования.
    """
    db_booking = services.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    # Проверяем, что это бронирование текущего пользователя
    if db_booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    return db_booking


@router.patch("/{booking_id}", response_model=schemas.Booking, tags=["bookings"])
def update_booking(
    booking_id: int,
    booking_update: schemas.BookingUpdate,
    db: Session = Depends(dependencies.get_db),
    current_user: user_models.User = Depends(get_current_active_user),
):
    """
    Обновить бронирование.
    Пользователь может изменять только свои бронирования.
    """
    db_booking = services.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    if db_booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    updated_booking = services.update_booking(db, booking_id=booking_id, update_data=booking_update)
    if updated_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return updated_booking


@router.post("/{booking_id}/cancel", response_model=schemas.Booking, tags=["bookings"])
def cancel_booking(
    booking_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: user_models.User = Depends(get_current_active_user),
):
    """
    Отменить бронирование.
    Пользователь может отменить только свои бронирования.
    """
    db_booking = services.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    if db_booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    cancelled_booking = services.cancel_booking(db, booking_id=booking_id)
    if cancelled_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return cancelled_booking


@router.delete("/{booking_id}", tags=["bookings"])
def delete_booking(
    booking_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: user_models.User = Depends(get_current_active_user),
):
    """
    Удалить бронирование.
    Пользователь может удалить только свои бронирования.
    """
    db_booking = services.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    if db_booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    deleted_booking = services.delete_booking(db, booking_id=booking_id)
    if deleted_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return {"message": f"Бронирование с id={booking_id} успешно удалено"}
