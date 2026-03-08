from pydantic import BaseModel
from datetime import date
from typing import Literal


class TransactionCreate(BaseModel):
    category_id: int
    amount: float
    type: Literal["income", "expense"]
    description: str | None = None
    transaction_date: date


class TransactionResponse(BaseModel):
    id: int
    category_id: int
    amount: float
    type: str
    description: str | None
    transaction_date: date

    class Config:
        from_attributes = True