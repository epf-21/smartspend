from sqlmodel import create_engine, SQLModel, Session
import os
from dotenv import load_dotenv
from contextlib import contextmanager
from app import models

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgresql:root@localhost/db_expenser"
)

engine = create_engine(DATABASE_URL, echo=True)


def init_db():
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session():
    with Session(engine) as session:
        yield session


def get_db_session():
    with get_session() as session:
        yield session
