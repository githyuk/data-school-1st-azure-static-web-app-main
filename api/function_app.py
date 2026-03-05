import azure.functions as func
import json
import pg8000.dbapi

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# 🛑 팀장님의 실제 DB 접속 정보를 입력하세요!
DB_CONFIG = {
    "host": "team4-db.postgres.database.azure.com",
    "database": "postgres",
    "user": "azure_root",
    "password": "qwer1234!",
    "port": 5432
}

def get_conn():
    return pg8000.dbapi.connect(**DB_CONFIG)

# [기능 1] 회원가입: 데이터를 DB에 저장!
@app.route(route="signup", methods=["POST"])
def signup(req: func.HttpRequest) -> func.HttpResponse:
    try:
        data = req.get_json()
        conn = get_conn()
        cursor = conn.cursor()
        
        # 스크린샷의 users 테이블 컬럼명과 정확히 일치시켰습니다.
        query = """
            INSERT INTO users (userid, password, name, address, birthyear)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['userid'], 
            data['password'], 
            data['name'], 
            data['address'], 
            int(data['birthyear'])
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return func.HttpResponse(
            body=json.dumps({"message": "가입을 환영합니다!"}),
            mimetype="application/json", status_code=200
        )
    except Exception as e:
        return func.HttpResponse(
            body=json.dumps({"detail": f"가입 실패: {str(e)}"}),
            mimetype="application/json", status_code=500
        )

# [기능 2] 로그인 (기존 코드 유지)
@app.route(route="login", methods=["POST"])
def login(req: func.HttpRequest) -> func.HttpResponse:
    try:
        data = req.get_json()
        conn = get_conn()
        cursor = conn.cursor()
        query = "SELECT name FROM users WHERE userid = %s AND password = %s"
        cursor.execute(query, (data['userid'], data['password']))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result:
            return func.HttpResponse(body=json.dumps({"username": result[0]}), mimetype="application/json")
        else:
            return func.HttpResponse(body=json.dumps({"detail": "정보 불일치"}), mimetype="application/json", status_code=401)
    except Exception as e:
        return func.HttpResponse(body=json.dumps({"detail": str(e)}), mimetype="application/json", status_code=500)

# [기능 3] 쉼터 정보 (지도용)
@app.route(route="shelters", methods=["GET"])
def get_shelters(req: func.HttpRequest) -> func.HttpResponse:
    shelters = [{"name": "강남구 대피소", "lat": 37.4979, "lng": 127.0276}]
    return func.HttpResponse(body=json.dumps(shelters), mimetype="application/json")
