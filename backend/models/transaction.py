from sqlalchemy import Column, Integer, ForeignKey, DECIMAL, String, Date, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from backend.config.database import Base
from datetime import datetime


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False
    )

    amount = Column(DECIMAL(10, 2), nullable=False)

    type = Column(Enum("income", "expense"), nullable=False)

    description = Column(String(255))

    transaction_date = Column(Date, nullable=False)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="transactions")
    category = relationship("Category")