import azure.functions as func
import json
import pg8000.native # 초경량 DB 라이브러리

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# ==========================================
# 🛑 여기에 팀장님의 실제 DB 정보를 넣어주세요!
# ==========================================
DB_HOST = "team4-db.postgres.database.azure.com"       # 예: my-postgres.postgres.database.azure.com
DB_NAME = "postgres"       # 예: postgres
DB_USER = "azure_root"     # 예: adminuser
DB_PASSWORD = "qwer1234!"  
# ==========================================

# DB 연결 함수
def get_db_connection():
    return pg8000.native.Connection(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        database=DB_NAME,
        port=5432
    )

# [기능 1] 로그인 기능: 유저 정보 테이블과 대조
@app.route(route="login", methods=["POST"])
def login(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # 프론트엔드에서 보낸 아이디와 비밀번호 받기
        req_body = req.get_json()
        userid = req_body.get('userid')
        password = req_body.get('password')

        # DB 연결 및 대조
        con = get_db_connection()
        # 프론트엔드 코드 보니까 이름 변수가 'name'이네요!
        # 테이블 이름이 'users'라고 가정했습니다. (다르면 수정해주세요)
        query = "SELECT name FROM users WHERE userid = :id AND password = :pw"
        result = con.run(query, id=userid, pw=password)
        con.close()

        # DB에 유저가 존재하면 (결과가 있으면)
        if result:
            user_name = result[0][0] # 첫 번째 줄, 첫 번째 칸(name)
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

# [기능 2] 쉼터 데이터 뿌려주기 (지도로 넘어간 뒤 실행됨)
@app.route(route="shelters", methods=["GET"])
def get_shelters(req: func.HttpRequest) -> func.HttpResponse:
    shelters_data = [
        {"name": "강남구 대피소", "lat": 37.4979, "lng": 127.0276},
        {"name": "서초구 쉼터", "lat": 37.4833, "lng": 127.0322}
    ]
    return func.HttpResponse(body=json.dumps(shelters_data), mimetype="application/json")