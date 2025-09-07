from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.api import categories, budgets, transactions
from app.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("Database initialized")
    yield
    print("Shutting down")


app = FastAPI(lifespan=lifespan)


app.include_router(categories.router, prefix="/api")
app.include_router(budgets.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "App is running"}
