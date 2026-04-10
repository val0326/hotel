from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from src import dependencies
from . import schemas, services
from .models import RoomType

router = APIRouter()


@router.post("/", response_model=schemas.Room, tags=["rooms"])
def create_room(room: schemas.RoomCreate, db: Session = Depends(dependencies.get_db)):
    db_room = services.get_room_by_number(db, room_number=room.room_number)
    if db_room:
        raise HTTPException(status_code=400, detail="Номер с таким номером уже существует")
    return services.create_room(db=db, room=room)


@router.get("/", response_model=list[schemas.Room], tags=["rooms"])
def read_rooms(
    skip: int = 0,
    limit: int = 100,
    room_type: RoomType | None = None,
    available_only: bool = False,
    db: Session = Depends(dependencies.get_db),
):
    rooms = services.get_rooms(
        db, skip=skip, limit=limit, room_type=room_type, available_only=available_only
    )
    return rooms


@router.get("/{room_id}", response_model=schemas.Room, tags=["rooms"])
def read_room(room_id: int, db: Session = Depends(dependencies.get_db)):
    db_room = services.get_room(db, room_id=room_id)
    if db_room is None:
        raise HTTPException(status_code=404, detail="Номер не найден")
    return db_room


@router.patch("/{room_id}", response_model=schemas.Room, tags=["rooms"])
def update_room(
    room_id: int,
    room_update: schemas.RoomUpdate,
    db: Session = Depends(dependencies.get_db),
):
    updated_room = services.update_room(db, room_id=room_id, update_data=room_update)
    if updated_room is None:
        raise HTTPException(status_code=404, detail="Номер не найден")
    return updated_room


@router.delete("/{room_id}", tags=["rooms"])
def delete_room(room_id: int, db: Session = Depends(dependencies.get_db)):
    deleted_room = services.delete_room(db, room_id=room_id)
    if deleted_room is None:
        raise HTTPException(status_code=404, detail="Номер не найден")
    return {"message": f"Номер с id={room_id} успешно удалён"}
