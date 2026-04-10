# Импортируем все модели, чтобы Base.metadata знал о всех таблицах
from src.apps.users import models as user_models  # noqa: F401
from src.apps.rooms import models as room_models  # noqa: F401
from src.apps.bookings import models as booking_models  # noqa: F401

from src.database import Base, engine


def init_db():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("База данных инициализирована")