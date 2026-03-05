import azure.functions as func
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

fastapi_app = FastAPI()

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@fastapi_app.get("/api/shelters")
def get_shelters():
    # DB 연결을 잠시 끄고 가짜 데이터를 보냅니다. 배포 성공 확인용입니다!
    return [{"name": "배포 성공 테스트용 쉼터", "lat": 37.5665, "lng": 126.9780}]

@fastapi_app.get("/api/login")
def login():
    return {"message": "로그인 서버가 살아있습니다!"}

app = func.AsgiFunctionApp(app=fastapi_app, http_auth_level=func.AuthLevel.ANONYMOUS)
