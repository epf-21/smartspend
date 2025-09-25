from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

origins = [
    "http://localhost:80",
    "http://127.0.0.1:80",
    "http://localhost:4200",
    "http://127.0.0.1:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router, prefix="/api")
app.include_router(budgets.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")


@app.get("/")
def read_root():
    return {"message": "App is running"}
