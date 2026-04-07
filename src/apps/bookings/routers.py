from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

import dependencies
from . import schemas, services
from .models import BookingStatus

router = APIRouter()


@router.post("/", response_model=schemas.Booking, tags=["bookings"])
def create_booking(
    booking: schemas.BookingCreate, db: Session = Depends(dependencies.get_db)
):
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
):
    bookings = services.get_bookings(
        db, skip=skip, limit=limit, user_id=user_id, status=status
    )
    return bookings


@router.get("/{booking_id}", response_model=schemas.Booking, tags=["bookings"])
def read_booking(booking_id: int, db: Session = Depends(dependencies.get_db)):
    db_booking = services.get_booking(db, booking_id=booking_id)
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return db_booking


@router.patch("/{booking_id}", response_model=schemas.Booking, tags=["bookings"])
def update_booking(
    booking_id: int,
    booking_update: schemas.BookingUpdate,
    db: Session = Depends(dependencies.get_db),
):
    updated_booking = services.update_booking(db, booking_id=booking_id, update_data=booking_update)
    if updated_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return updated_booking


@router.post("/{booking_id}/cancel", response_model=schemas.Booking, tags=["bookings"])
def cancel_booking(booking_id: int, db: Session = Depends(dependencies.get_db)):
    cancelled_booking = services.cancel_booking(db, booking_id=booking_id)
    if cancelled_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return cancelled_booking


@router.delete("/{booking_id}", tags=["bookings"])
def delete_booking(booking_id: int, db: Session = Depends(dependencies.get_db)):
    deleted_booking = services.delete_booking(db, booking_id=booking_id)
    if deleted_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return {"message": f"Бронирование с id={booking_id} успешно удалено"}
