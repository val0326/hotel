from apps.users import models
from database import Base, engine

def init_db():
    Base.metadata.create_all(bind=engine)