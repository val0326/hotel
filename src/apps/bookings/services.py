from sqlalchemy.orm import Session
from datetime import datetime

from src.apps.rooms.models import Room, RoomStatus
from src.apps.users.models import User
from . import models, schemas


def get_booking(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()


def get_bookings(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: int | None = None,
    status: models.BookingStatus | None = None,
):
    query = db.query(models.Booking)
    if user_id:
        query = query.filter(models.Booking.user_id == user_id)
    if status:
        query = query.filter(models.Booking.status == status)
    return query.offset(skip).limit(limit).all()


def calculate_total_price(check_in: datetime, check_out: datetime, price_per_night: float) -> float:
    nights = (check_out - check_in).days
    if nights < 1:
        nights = 1
    return nights * price_per_night


def is_room_available(db: Session, room_id: int, check_in: datetime, check_out: datetime) -> bool:
    overlapping_bookings = (
        db.query(models.Booking)
        .filter(
            models.Booking.room_id == room_id,
            models.Booking.status.in_([models.BookingStatus.CONFIRMED, models.BookingStatus.PENDING]),
            models.Booking.check_in < check_out,
            models.Booking.check_out > check_in,
        )
        .count()
    )
    return overlapping_bookings == 0


def create_booking(db: Session, booking: schemas.BookingCreate):
    # Проверяем существование пользователя
    user = db.query(User).filter(User.id == booking.user_id).first()
    if not user:
        raise ValueError("Пользователь не найден")

    # Проверяем существование номера
    room = db.query(Room).filter(Room.id == booking.room_id).first()
    if not room:
        raise ValueError("Номер не найден")

    # Проверяем доступность номера
    if not room.is_available:
        raise ValueError("Номер недоступен")

    # Проверяем, нет ли пересечений с другими бронированиями
    if not is_room_available(db, booking.room_id, booking.check_in, booking.check_out):
        raise ValueError("Номер уже забронирован на выбранные даты")

    # Рассчитываем стоимость
    total_price = calculate_total_price(booking.check_in, booking.check_out, room.price_per_night)

    db_booking = models.Booking(
        user_id=booking.user_id,
        room_id=booking.room_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        total_price=total_price,
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


def update_booking(db: Session, booking_id: int, update_data: schemas.BookingUpdate):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        return None

    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(db_booking, key, value)

    db.commit()
    db.refresh(db_booking)
    return db_booking


def cancel_booking(db: Session, booking_id: int):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        return None
    db_booking.status = models.BookingStatus.CANCELLED
    db.commit()
    db.refresh(db_booking)
    return db_booking


def delete_booking(db: Session, booking_id: int):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        return None
    db.delete(db_booking)
    db.commit()
    return db_booking
