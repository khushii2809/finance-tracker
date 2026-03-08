from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.middleware.cors import CORSMiddleware

from backend.config.database import engine, Base, get_db

# Register models
from backend.models import user
from backend.models.category import Category
from backend.models.transaction import Transaction
from backend.models.budget import Budget

# Schemas
from backend.schemas.user import UserCreate, UserResponse
from backend.schemas.category import CategoryCreate, CategoryResponse
from backend.schemas.transaction import TransactionCreate, TransactionResponse
from backend.schemas.budget import BudgetCreate, BudgetResponse

# Security
from backend.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from backend.utils.dependencies import get_current_user


app = FastAPI(
    title="Personal Finance & Productivity API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)


# ==========================
# ROOT
# ==========================

@app.get("/")
def root():
    return {"message": "Finance & Productivity API is running"}


# ==========================
# USER ENDPOINTS
# ==========================

@app.post("/users", response_model=UserResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(user.User).filter(
        user.User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user_data.password)

    new_user = user.User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(user.User).filter(
        user.User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": str(db_user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(user.User).all()


# ==========================
# AUTH PROTECTED ROUTES
# ==========================

@app.get("/me", response_model=UserResponse)
def read_current_user(current_user: user.User = Depends(get_current_user)):
    return current_user


# ==========================
# CATEGORY ROUTES
# ==========================

@app.post("/categories", response_model=CategoryResponse)
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):
    new_category = Category(
        name=category_data.name,
        type=category_data.type,
        user_id=current_user.id
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


@app.get("/categories", response_model=list[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):
    return db.query(Category).filter(
        Category.user_id == current_user.id
    ).all()


# ==========================
# TRANSACTION ROUTES
# ==========================

@app.post("/transactions", response_model=TransactionResponse)
def create_transaction(
    transaction_data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):

    category = db.query(Category).filter(
        Category.id == transaction_data.category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")

    new_transaction = Transaction(
        user_id=current_user.id,
        category_id=transaction_data.category_id,
        amount=transaction_data.amount,
        type=transaction_data.type,
        description=transaction_data.description,
        transaction_date=transaction_data.transaction_date
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction


@app.get("/transactions", response_model=list[TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):
    return db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).all()


# ==========================
# ANALYTICS ROUTES
# ==========================

@app.get("/summary")
def get_monthly_summary(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):

    base_query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        func.month(Transaction.transaction_date) == month,
        func.year(Transaction.transaction_date) == year
    )

    total_income = base_query.filter(
        Transaction.type == "income"
    ).with_entities(func.sum(Transaction.amount)).scalar() or 0

    total_expense = base_query.filter(
        Transaction.type == "expense"
    ).with_entities(func.sum(Transaction.amount)).scalar() or 0

    return {
        "month": month,
        "year": year,
        "total_income": float(total_income),
        "total_expense": float(total_expense),
        "net_balance": float(total_income) - float(total_expense)
    }


@app.get("/monthly-balance")
def monthly_balance(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):

    income = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income",
        func.month(Transaction.transaction_date) == month,
        func.year(Transaction.transaction_date) == year
    ).scalar()

    expense = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        func.month(Transaction.transaction_date) == month,
        func.year(Transaction.transaction_date) == year
    ).scalar()

    savings = float(income) - float(expense)
    savings_rate = (savings / float(income) * 100) if float(income) > 0 else 0

    return {
        "month": month,
        "year": year,
        "total_income": float(income),
        "total_expense": float(expense),
        "net_savings": savings,
        "savings_rate_percent": round(savings_rate, 2)
    }

@app.get("/category-breakdown")
def category_breakdown(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):
    # Total expense for month
    total_expense = db.query(
        func.coalesce(func.sum(Transaction.amount), 0)
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        func.month(Transaction.transaction_date) == month,
        func.year(Transaction.transaction_date) == year
    ).scalar()

    # Grouped expense by category
    results = db.query(
        Category.id,
        Category.name,
        func.coalesce(func.sum(Transaction.amount), 0).label("total")
    ).join(
        Transaction, Transaction.category_id == Category.id
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        func.month(Transaction.transaction_date) == month,
        func.year(Transaction.transaction_date) == year
    ).group_by(
        Category.id,
        Category.name
    ).all()

    response = []

    for category_id, category_name, total in results:
        percentage = 0
        if float(total_expense) > 0:
            percentage = (float(total) / float(total_expense)) * 100

        response.append({
            "category_id": category_id,
            "category_name": category_name,
            "total_expense": float(total),
            "percentage": round(percentage, 2)
        })

    return {
        "month": month,
        "year": year,
        "total_expense": float(total_expense),
        "breakdown": response
    }
@app.get("/dashboard")
def dashboard(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):
    # Income
    income = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income",
        func.month(Transaction.transaction_date) == month,
        func.year(Transaction.transaction_date) == year
    ).scalar()

    # Expense
    expense = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        func.month(Transaction.transaction_date) == month,
        func.year(Transaction.transaction_date) == year
    ).scalar()

    savings = float(income) - float(expense)
    savings_rate = (savings / float(income) * 100) if float(income) > 0 else 0

    # Category breakdown
    category_data = db.query(
        Category.name,
        func.coalesce(func.sum(Transaction.amount), 0).label("total")
    ).join(
        Transaction, Transaction.category_id == Category.id
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        func.month(Transaction.transaction_date) == month,
        func.year(Transaction.transaction_date) == year
    ).group_by(Category.name).all()

    breakdown = [
        {"category": name, "total_expense": float(total)}
        for name, total in category_data
    ]

    return {
        "month": month,
        "year": year,
        "total_income": float(income),
        "total_expense": float(expense),
        "net_savings": savings,
        "savings_rate_percent": round(savings_rate, 2),
        "category_breakdown": breakdown
    }

# ==========================
# BUDGET ROUTES
# ==========================

@app.post("/budgets", response_model=BudgetResponse)
def create_budget(
    budget_data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):

    category = db.query(Category).filter(
        Category.id == budget_data.category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")

    new_budget = Budget(
        user_id=current_user.id,
        category_id=budget_data.category_id,
        month=budget_data.month,
        year=budget_data.year,
        amount=budget_data.amount
    )

    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)

    return new_budget

@app.get("/budget-analysis")
def budget_analysis(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: user.User = Depends(get_current_user)
):

    budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == month,
        Budget.year == year
    ).all()

    response = []

    for budget in budgets:

        actual_expense = db.query(
            func.coalesce(func.sum(Transaction.amount), 0)
        ).filter(
            Transaction.user_id == current_user.id,
            Transaction.category_id == budget.category_id,
            Transaction.type == "expense",
            func.month(Transaction.transaction_date) == month,
            func.year(Transaction.transaction_date) == year
        ).scalar()

        difference = float(budget.amount) - float(actual_expense)

        response.append({
            "category_id": budget.category_id,
            "budget_amount": float(budget.amount),
            "actual_expense": float(actual_expense),
            "difference": difference,
            "status": "Over Budget" if difference < 0 else "Within Budget"
        })

    return response