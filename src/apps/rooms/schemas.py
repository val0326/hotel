from pydantic import BaseModel, field_validator
from .models import RoomType, RoomStatus


class RoomBase(BaseModel):
    room_number: str
    room_type: RoomType
    price_per_night: float
    capacity: int = 1
    floor: int = 1
    description: str | None = None

    @field_validator("price_per_night")
    @classmethod
    def price_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Цена за ночь должна быть положительной")
        return v

    @field_validator("capacity")
    @classmethod
    def capacity_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Вместимость должна быть не менее 1")
        return v


class RoomCreate(RoomBase):
    pass


class RoomUpdate(BaseModel):
    room_type: RoomType | None = None
    price_per_night: float | None = None
    capacity: int | None = None
    floor: int | None = None
    description: str | None = None
    is_available: bool | None = None
    status: RoomStatus | None = None

    @field_validator("price_per_night")
    @classmethod
    def price_positive(cls, v: float | None) -> float | None:
        if v is not None and v <= 0:
            raise ValueError("Цена за ночь должна быть положительной")
        return v


class Room(RoomBase):
    id: int
    is_available: bool
    status: RoomStatus

    class Config:
        from_attributes = True
