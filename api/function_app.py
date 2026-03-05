import azure.functions as func
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
from fastapi.middleware.cors import CORSMiddleware

# ⚠️ 이름이 app 에서 fastapi_app 으로 바뀝니다!
fastapi_app = FastAPI(title="세이프 패스 API 서버")

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

class UserSignup(BaseModel):
    userid: str
    password: str
    name: str
    birthyear: int
    address: str

class UserLogin(BaseModel):
    userid: str
    password: str

# 1. 회원가입
@fastapi_app.post("/api/signup")
def create_user(user: UserSignup):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        query = "INSERT INTO users (userid, password, name, address, birthyear) VALUES (%s, %s, %s, %s, %s)"
        cur.execute(query, (user.userid, user.password, user.name, user.address, user.birthyear))
        conn.commit()
        return {"status": "success", "message": f"환영합니다, {user.name} 님! 가입이 완료되었습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals(): cur.close(); conn.close()

# 2. 로그인
@fastapi_app.post("/api/login")
def login_user(user: UserLogin):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("SELECT password, name FROM users WHERE userid = %s", (user.userid,))
        result = cur.fetchone()

        if result is None:
            raise HTTPException(status_code=400, detail="존재하지 않는 아이디입니다.")

        db_password, db_name = result

        if db_password != user.password:
            raise HTTPException(status_code=400, detail="비밀번호가 일치하지 않습니다.")

        return {
            "status": "success",
            "message": f"{db_name}님 환영합니다!",
            "username": db_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals(): cur.close(); conn.close()

# 3. 쉼터 데이터
@fastapi_app.get("/api/shelters")
def get_shelters():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        query = """
            SELECT shelter_name, lat, lon FROM heat_shelter
            UNION ALL
            SELECT shelter_name, lat, lon FROM cold_shelter
        """
        cur.execute(query)
        rows = cur.fetchall()

        shelters = []
        for row in rows:
            shelters.append({"name": row[0], "lat": float(row[1]), "lng": float(row[2])})
        return shelters
    except Exception as e:
        print(f"DB 에러: {e}")
        return []
    finally:
        if 'conn' in locals(): cur.close(); conn.close()

# 💡 [핵심] Azure가 이 파일을 API로 인식하도록 포장(Wrapping) 해주는 마법의 한 줄입니다!
app = func.AsgiFunctionApp(app=fastapi_app, http_auth_level=func.AuthLevel.ANONYMOUS)
