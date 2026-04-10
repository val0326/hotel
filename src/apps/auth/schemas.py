from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    """Схема токена доступа"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Схема данных токена"""
    user_id: Optional[int] = None


class UserLogin(BaseModel):
    """Схема для входа пользователя"""
    email: EmailStr
    password: str
