import azure.functions as func
import json
import pg8000.dbapi # 애저가 좋아하는 가벼운 DB 라이브러리

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# ==========================================
# 🛑 스크린샷에서 유추한 팀장님의 DB 정보입니다!
# DB_USER와 DB_PASSWORD만 정확히 채워주세요.
# ==========================================
DB_HOST = "team4-db.postgres.database.azure.com"
DB_NAME = "postgres"
DB_USER = "azure_root"     # 예: team4admin
DB_PASSWORD = "qwer1234!"
# ==========================================

# DB 연결 함수
def get_db_connection():
    return pg8000.dbapi.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        database=DB_NAME,
        port=5432
    )

# [기능 1] 로그인: users 테이블과 대조!
@app.route(route="login", methods=["POST"])
def login(req: func.HttpRequest) -> func.HttpResponse:
    try:
        req_body = req.get_json()
        userid = req_body.get('userid')
        password = req_body.get('password')

        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 쿼리문: userid와 password가 일치하면 name을 가져옵니다.
        query = "SELECT name FROM users WHERE userid = %s AND password = %s"
        cursor.execute(query, (userid, password))
        result = cursor.fetchone()
        
        cursor.close()
        conn.close()

        # DB에 유저가 존재하면
        if result:
            user_name = result[0] # DB에서 가져온 진짜 이름!
            return func.HttpResponse(
                body=json.dumps({"username": user_name}),
                mimetype="application/json",
                status_code=200
            )
        else:
            return func.HttpResponse(
                body=json.dumps({"detail": "아이디나 비밀번호가 틀렸습니다."}),
                mimetype="application/json",
                status_code=401
            )
            
    except Exception as e:
        return func.HttpResponse(
            body=json.dumps({"detail": f"DB 연결 에러: {str(e)}"}),
            mimetype="application/json",
            status_code=500
        )

# [기능 2] 쉼터 데이터 뿌려주기
@app.route(route="shelters", methods=["GET"])
def get_shelters(req: func.HttpRequest) -> func.HttpResponse:
    shelters_data = [
        {"name": "강남구 대피소", "lat": 37.4979, "lng": 127.0276},
        {"name": "서초구 쉼터", "lat": 37.4833, "lng": 127.0322}
    ]
    return func.HttpResponse(body=json.dumps(shelters_data), mimetype="application/json")
