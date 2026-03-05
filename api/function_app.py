import azure.functions as func
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
    # 이제 여기에 진짜 DB 데이터를 넣거나, 일단 아래처럼 실제 좌표들을 넣어보세요!
    return [
        {"name": "강남구 대피소", "lat": 37.4979, "lng": 127.0276},
        {"name": "서초구 쉼터", "lat": 37.4833, "lng": 127.0322}
    ]

app = func.AsgiFunctionApp(app=fastapi_app, http_auth_level=func.AuthLevel.ANONYMOUS)
