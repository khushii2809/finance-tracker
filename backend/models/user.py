from sqlalchemy import Column, Integer, String
from backend.config.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))

    categories = relationship("Category", back_populates="user", cascade="all, delete")
    transactions = relationship(
    "Transaction",
    back_populates="user",
    cascade="all, delete"
)