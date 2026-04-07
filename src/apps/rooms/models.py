from sqlalchemy import Column, Integer, String, Float, Boolean, Enum
from sqlalchemy.orm import relationship
import enum

from database import Base


class RoomType(str, enum.Enum):
    SINGLE = "single"
    DOUBLE = "double"
    SUITE = "suite"
    DELUXE = "deluxe"


class RoomStatus(str, enum.Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, index=True, nullable=False)
    room_type = Column(Enum(RoomType), nullable=False, default=RoomType.SINGLE)
    price_per_night = Column(Float, nullable=False)
    capacity = Column(Integer, nullable=False, default=1)
    floor = Column(Integer, nullable=False, default=1)
    description = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    status = Column(Enum(RoomStatus), default=RoomStatus.AVAILABLE)

    # Relationship с бронированиями
    bookings = relationship("Booking", back_populates="room")
