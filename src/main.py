from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routers import router
from config import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
)


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
