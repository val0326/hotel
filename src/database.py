from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db_session() -> Session:
    """Создаёт новую сессию БД."""
    return SessionLocal()


@contextmanager
def get_db_context():
    """Контекстный менеджер для безопасной работы с сессией."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    """Создаёт все таблицы, если они не существуют."""
    Base.metadata.create_all(bind=engine)
