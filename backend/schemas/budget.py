from pydantic import BaseModel


class BudgetCreate(BaseModel):
    category_id: int
    month: int
    year: int
    amount: float


class BudgetResponse(BaseModel):
    id: int
    category_id: int
    month: int
    year: int
    amount: float

    class Config:
        from_attributes = True