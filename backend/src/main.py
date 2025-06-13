from fastapi import FastAPI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from src.routes.route_sumrize import router as summarize_router

load_dotenv()

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8080","https://text-summarizer-v2-hcogprguf-imdhirajs-projects.vercel.app","https://text-summarizer-v2.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(summarize_router, prefix="/api/v1")