from src.apps.users import models
from src.database import Base, engine

def init_db():
    Base.metadata.create_all(bind=engine)