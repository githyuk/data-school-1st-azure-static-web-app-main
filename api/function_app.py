import azure.functions as func
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# 프론트엔드가 애타게 찾는 '/api/shelters' 주소입니다!
@app.route(route="shelters")
def get_shelters(req: func.HttpRequest) -> func.HttpResponse:
    # 지도에 찍힐 진짜(가짜) 마커 데이터 2개
    shelters_data = [
        {"name": "강남구 대피소", "lat": 37.4979, "lng": 127.0276},
        {"name": "서초구 쉼터", "lat": 37.4833, "lng": 127.0322}
    ]
    
    return func.HttpResponse(
        body=json.dumps(shelters_data),
        mimetype="application/json",
        status_code=200
    )