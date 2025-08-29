from typing import Union
from .routers import auth, workouts, routines

from .database import engine, Base

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

app.include_router(auth.router)
app.include_router(workouts.router)
app.include_router(routines.router)
