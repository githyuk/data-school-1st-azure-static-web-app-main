/**
 * [1단계] 전역 변수 및 지도 초기 설정
 */
var container = document.getElementById('map');
var options = { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 4 };
var map = new kakao.maps.Map(container, options);

var myMarker = null;      // 내 위치 마커
var polyline = null;      // 지도에 그려질 파란색 경로 선
var routeSteps = [];      // 경로의 상세 지점들 (위도, 경도, 안내문구)
var lastSpokenStep = -1;  // 마지막으로 음성 안내가 나간 지점 번호

var fontSize = 20;        // 기본 자막 글자 크기
var MIN_FONT_SIZE = 16;   // 최소 크기 제한
var MAX_FONT_SIZE = 36;   // 최대 크기 제한

/**
 * [2단계] 음성 출력 및 자막 제어 함수
 */
function speak(text) {
    // 자막 박스에 텍스트 표시
    var subtitleBox = document.getElementById('subtitle-box');
    if (subtitleBox) {
        subtitleBox.innerHTML = "🔊 " + text;
    }

    // 브라우저 음성 합성(TTS) 실행
    if (typeof SpeechSynthesisUtterance === "undefined") return;
    window.speechSynthesis.cancel(); // 현재 나오는 소리 중단
    var msg = new SpeechSynthesisUtterance(text);
    msg.lang = "ko-KR";
    msg.rate = 0.85; // 어르신들을 위해 약간 천천히
    window.speechSynthesis.speak(msg);
}

/**
 * [3단계] 글자 크기 조절 및 버튼 활성화 상태 관리
 */
function changeFontSize(delta) {
    var newSize = fontSize + delta;
    var subtitleBox = document.getElementById('subtitle-box');
    
    // 설정한 범위(16~36) 내에서만 크기 변경 허용
    if (newSize >= MIN_FONT_SIZE && newSize <= MAX_FONT_SIZE) {
        fontSize = newSize;
        if (subtitleBox) subtitleBox.style.fontSize = fontSize + "px";
        speak("글자 크기를 조정했습니다.");
    }
    updateFontSizeButtons(); // 버튼 색상 업데이트
}

function updateFontSizeButtons() {
    var btnPlus = document.getElementById('btn-font-plus');
    var btnMinus = document.getElementById('btn-font-minus');
    if (!btnPlus || !btnMinus) return;

    // 최대 크기 도달 시 "+" 버튼 회색으로 비활성화
    if (fontSize >= MAX_FONT_SIZE) {
        btnPlus.style.backgroundColor = "#e0e0e0";
        btnPlus.style.color = "#a0a0a0";
        btnPlus.disabled = true;
    } else {
        btnPlus.style.backgroundColor = "white";
        btnPlus.style.color = "black";
        btnPlus.disabled = false;
    }

    // 최소 크기 도달 시 "-" 버튼 회색으로 비활성화
    if (fontSize <= MIN_FONT_SIZE) {
        btnMinus.style.backgroundColor = "#e0e0e0";
        btnMinus.style.color = "#a0a0a0";
        btnMinus.disabled = true;
    } else {
        btnMinus.style.backgroundColor = "white";
        btnMinus.style.color = "black";
        btnMinus.disabled = false;
    }
}

/**
 * [4단계] 위치 정보 권한 및 에러 처리
 */
function handleLocationError(error) {
    var msg = "";
    var isPermissionDenied = false;
    var subtitleBox = document.getElementById('subtitle-box');
    if (subtitleBox) subtitleBox.style.background = "rgba(231, 76, 60, 0.9)"; // 에러 시 빨간 배경
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            msg = "위치 허용이 거절되었습니다. <br><b>설정에서 위치 권한을 '허용'으로 바꿔주세요.</b>";
            isPermissionDenied = true;
            break;
        case error.POSITION_UNAVAILABLE:
            msg = "위치 정보를 가져올 수 없습니다. GPS를 켜주세요.";
            break;
        case error.TIMEOUT:
            msg = "확인 시간이 초과되었습니다. 다시 시도합니다.";
            break;
        default:
            msg = "오류가 발생했습니다. 다시 시도 중...";
    }

    if (subtitleBox) subtitleBox.innerHTML = "⚠️ " + msg;
    speak(msg.replace("<br>", " "));

    // 권한 거절 시 무한 재시도 레이어 띄움
    if (isPermissionDenied) showRetryOverlay();
    else setTimeout(initLocation, 3000); // 단순 오류는 3초 후 자동 재시도
}

function initLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            var locPos = new kakao.maps.LatLng(lat, lng);
            
            // 내 위치 마커가 없으면 생성, 있으면 위치 이동
            if (!myMarker) {
                var imageSize = new kakao.maps.Size(35, 35);
                var markerImage = new kakao.maps.MarkerImage('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', imageSize);
                myMarker = new kakao.maps.Marker({ position: locPos, image: markerImage, map: map });
            } else {
                myMarker.setPosition(locPos);
            }
            map.setCenter(locPos);
            
            var subtitleBox = document.getElementById('subtitle-box');
            if (subtitleBox) subtitleBox.style.background = "rgba(0,0,0,0.85)"; // 정상 복구
            speak("내 위치를 확인했습니다. 가고 싶은 쉼터를 눌러보세요.");
        }, handleLocationError);
    }
}

/**
 * [5단계] UI 레이어 생성 (시작 안내, 재시도 레이어, 자막바)
 */
function createUI() {
    // 1. 초기 시작 안내 (소리 켜기)
    var welcome = document.createElement('div');
    welcome.id = 'welcome-layer';
    welcome.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:white; z-index:10000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center;';
    welcome.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 20px;">🔊</div>
        <h1 style="font-size: 30px;">반갑습니다!</h1>
        <p style="font-size: 22px;">안내를 위해 <b>소리를 크게</b> 키워주세요.</p>
        <button onclick="startApp()" style="margin-top: 30px; padding: 20px 50px; font-size: 24px; background: #4CAF50; color: white; border: none; border-radius: 15px; font-weight: bold;">확인했습니다</button>
    `;
    document.body.appendChild(welcome);

    // 2. 하단 UI 컨테이너 (버튼 + 자막박스)
    var ui = document.createElement('div');
    ui.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); width:90%; z-index:9999; display:flex; flex-direction:column; gap:10px;';
    ui.innerHTML = `
        <div style="display:flex; justify-content:flex-end; gap:5px;">
            <button id="btn-font-plus" onclick="changeFontSize(4)" style="padding:10px 15px; background:white; border:1px solid #ccc; border-radius:5px; font-weight:bold;">글자 +</button>
            <button id="btn-font-minus" onclick="changeFontSize(-4)" style="padding:10px 15px; background:white; border:1px solid #ccc; border-radius:5px; font-weight:bold;">글자 -</button>
        </div>
        <div id="subtitle-box" style="background:rgba(0,0,0,0.85); color:white; padding:20px; border-radius:15px; font-size:20px; font-weight:bold; text-align:center; min-height:60px; line-height:1.4;">주변 쉼터를 찾는 중...</div>
    `;
    document.body.appendChild(ui);
    updateFontSizeButtons(); // 초기 버튼 상태 설정
}

function startApp() {
    document.getElementById('welcome-layer').remove();
    initLocation();
}

function showRetryOverlay() {
    if (document.getElementById('retry-layer')) return;
    var retry = document.createElement('div');
    retry.id = 'retry-layer';
    retry.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.95); z-index:10001; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center;';
    retry.innerHTML = `
        <div style="font-size: 60px;">📍</div>
        <h2>위치 권한이 필요합니다</h2>
        <p>1. 주소창 옆 자물쇠 클릭 <br> 2. 위치 권한 '허용' 선택 <br> 3. 아래 버튼 클릭</p>
        <button onclick="location.reload()" style="padding: 20px 40px; font-size: 20px; background: #3498db; color: white; border: none; border-radius: 10px;">다시 시도하기</button>
    `;
    document.body.appendChild(retry);
}

function findRoute(endLat, endLng, shelterName) {
  navigator.geolocation.getCurrentPosition(function (pos) {
    var startLat = pos.coords.latitude;
    var startLng = pos.coords.longitude;
    var url =
      "https://router.project-osrm.org/route/v1/foot/" +
      startLng +
      "," +
      startLat +
      ";" +
      endLng +
      "," +
      endLat +
      "?overview=full&geometries=geojson&steps=true";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "Ok") {
          var route = data.routes[0];
          var coords = route.geometry.coordinates;
          var linePath = coords.map((c) => new kakao.maps.LatLng(c[1], c[0]));
          routeSteps = [];
          route.legs[0].steps.forEach(function (step) {
            // 1. 안내 문구(instruction)가 있는지 확인하고, 없으면 기본 메시지 처리
            var m = step.maneuver;
            var type = m.type;
            var modifier = m.modifier;
            var stepText = "";

            // 1. [통역 로직] 타입별로 한국어 문장을 만듭니다.
            switch (type) {
              case "depart":
                // stepText = "안내를 시작합니다. ";
                if (modifier === "right")
                  stepText += "오른쪽 방향으로 이동하세요.";
                else if (modifier === "left")
                  stepText += "왼쪽 방향으로 이동하세요.";
                else stepText += "직진 방향으로 출발하세요.";
                break;
              case "turn":
                if (modifier === "left")
                  stepText = "잠시 후 왼쪽으로 꺾으세요.";
                else if (modifier === "right")
                  stepText = "잠시 후 오른쪽으로 꺾으세요.";
                else if (modifier === "sharp left")
                  stepText = "잠시 후 왼쪽으로 크게 꺾으세요.";
                else if (modifier === "sharp right")
                  stepText = "잠시 후 오른쪽으로 크게 꺾으세요.";
                else stepText = "잠시 후 회전하세요.";
                break;
              case "arrive":
                stepText = "목적지 근처에 도착했습니다. 안내를 종료합니다.";
                break;
              case "merge":
                stepText = "길이 합쳐지는 구간입니다. 주의해서 이동하세요.";
                break;
              default:
                // 만약 API가 준 instruction이 있다면 그걸 쓰고, 없으면 기본값
                stepText = m.instruction || "경로를 따라 계속 이동하세요.";
            }

            routeSteps.push({
              lat: step.maneuver.location[1],
              lng: step.maneuver.location[0],
              instruction: stepText, // 이제 undefined 대신 문구가 들어갑니다!
            });
          });
          if (polyline) polyline.setMap(null);
          polyline = new kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 8,
            strokeColor: "#3301fc",
            strokeOpacity: 0.8,
          });
          polyline.setMap(map);
          var bounds = new kakao.maps.LatLngBounds();
          linePath.forEach((p) => bounds.extend(p));
          map.setBounds(bounds);
          speak(
            shelterName +
              " 까지 안내를 시작합니다. " +
              routeSteps[0].instruction,
          );
          lastSpokenStep = 0;
          startTracking();
        }
      });
  });
}

// 쉼터 데이터는 파이썬에서 주입받을 예정이므로 변수 이름만 맞춰둡니다.
window.initMarkers = function (shelterData) {
  shelterData.forEach(function (s) {
    var marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(s.lat, s.lng),
      map: map,
    });
    var content =
      '<div style="padding:10px; font-size:14px; color:black; min-width:150px;">' +
      "<strong>" +
      s.name +
      "</strong><br>" +
      '<button onclick="findRoute(' +
      s.lat +
      "," +
      s.lng +
      ", '" +
      s.name +
      '\')" style="margin-top:10px; cursor:pointer; width:100%; height:30px; background:#4CAF50; color:white; border:none; border-radius:5px;">🚶 여기로 길안내 시작</button>' +
      "</div>";
    var infowindow = new kakao.maps.InfoWindow({
      content: content,
      removable: true,
    });
    kakao.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });
  });
};

createUI();