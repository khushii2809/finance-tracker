from sqlalchemy import Column, Integer, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from backend.config.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)

    amount = Column(DECIMAL(10, 2), nullable=False)

    user = relationship("User")
    category = relationship("Category")