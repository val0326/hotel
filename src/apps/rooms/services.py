from sqlalchemy.orm import Session

from . import models, schemas


def get_room(db: Session, room_id: int):
    return db.query(models.Room).filter(models.Room.id == room_id).first()


def get_room_by_number(db: Session, room_number: str):
    return db.query(models.Room).filter(models.Room.room_number == room_number).first()


def get_rooms(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    room_type: models.RoomType | None = None,
    available_only: bool = False,
):
    query = db.query(models.Room)
    if room_type:
        query = query.filter(models.Room.room_type == room_type)
    if available_only:
        query = query.filter(models.Room.is_available == True)
    return query.offset(skip).limit(limit).all()


def create_room(db: Session, room: schemas.RoomCreate):
    db_room = models.Room(**room.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room


def update_room(db: Session, room_id: int, update_data: schemas.RoomUpdate):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        return None

    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(db_room, key, value)

    db.commit()
    db.refresh(db_room)
    return db_room


def delete_room(db: Session, room_id: int):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        return None
    db.delete(db_room)
    db.commit()
    return db_room
