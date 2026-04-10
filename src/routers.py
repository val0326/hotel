from fastapi import APIRouter

from src.apps.users.routers import router as user_router
from src.apps.rooms.routers import router as room_router
from src.apps.bookings.routers import router as booking_router
from src.apps.auth.routers import router as auth_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth")
router.include_router(user_router, prefix="/users")
router.include_router(room_router, prefix="/rooms")
router.include_router(booking_router, prefix="/bookings")
