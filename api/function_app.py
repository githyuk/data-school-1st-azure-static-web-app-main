import azure.functions as func
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from fastapi.middleware.cors import CORSMiddleware

# FastAPI 앱 설정
fastapi_app = FastAPI()

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": "team4-db.postgres.database.azure.com",
    "database": "postgres",
    "user": "azure_root",
    "password": "qwer1234!",
    "port": "5432",
    "sslmode": "require"
}

@fastapi_app.get("/api/shelters")
def get_shelters():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT shelter_name, lat, lon FROM heat_shelter UNION ALL SELECT shelter_name, lat, lon FROM cold_shelter")
        rows = cur.fetchall()
        return [{"name": r[0], "lat": float(r[1]), "lng": float(r[2])} for r in rows]
    except Exception as e:
        return []
    finally:
        if 'conn' in locals(): cur.close(); conn.close()

# 💡 이 한 줄이 핵심입니다.
app = func.AsgiFunctionApp(app=fastapi_app, http_auth_level=func.AuthLevel.ANONYMOUS)
