import azure.functions as func
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# 프론트엔드에서 /api/shelters 로 호출하면 이 함수가 실행됩니다.
@app.route(route="shelters")
def get_shelters(req: func.HttpRequest) -> func.HttpResponse:
    # 지도에 뿌려질 가짜 쉼터 데이터 2개
    shelters_data = [
        {"name": "강남구 대피소", "lat": 37.4979, "lng": 127.0276},
        {"name": "서초구 쉼터", "lat": 37.4833, "lng": 127.0322}
    ]
    
    return func.HttpResponse(
        body=json.dumps(shelters_data),
        mimetype="application/json",
        status_code=200
    )
