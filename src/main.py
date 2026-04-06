from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routers import router
from config import settings

from init_db import init_db




app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)


@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router, prefix=settings.API_PREFIX)


@app.get("/health")
def root():
    return {"status": "OK"}
