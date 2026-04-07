from pydantic import BaseModel, field_validator, ConfigDict
from datetime import datetime
from .models import BookingStatus


class BookingBase(BaseModel):
    user_id: int
    room_id: int
    check_in: datetime
    check_out: datetime

    @field_validator("check_out")
    @classmethod
    def check_out_after_check_in(cls, v: datetime, info) -> datetime:
        if "check_in" in info.data and v <= info.data["check_in"]:
            raise ValueError("Дата выезда должна быть позже даты заезда")
        return v


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    check_in: datetime | None = None
    check_out: datetime | None = None
    status: BookingStatus | None = None

    @field_validator("check_out")
    @classmethod
    def check_out_after_check_in(cls, v: datetime | None, info) -> datetime | None:
        if v is not None and "check_in" in info.data and v <= info.data["check_in"]:
            raise ValueError("Дата выезда должна быть позже даты заезда")
        return v


class Booking(BookingBase):
    id: int
    total_price: float
    status: BookingStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
