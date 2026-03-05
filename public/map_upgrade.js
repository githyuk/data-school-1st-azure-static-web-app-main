// 전역 변수 선언
var map = null;
var myMarker = null;
var polyline = null;

// 1. 지도 초기화 (리액트가 호출함)
window.initMap = function() {
    var container = document.getElementById('map');
    if (!container) return;
    var options = { center: new kakao.maps.LatLng(37.5665, 126.9780), level: 4 };
    map = new kakao.maps.Map(container, options);
};

// 2. 길찾기 로직 (간소화)
window.findRoute = function(lat, lng, shelterName) {
    if (!map) return;
    var startLat = 37.5657; // 테스트용 현재 위치 (시청역)
    var startLng = 126.9769;

    var moveLatLon = new kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLon);
    
    if (polyline) polyline.setMap(null);
    var linePath = [
        new kakao.maps.LatLng(startLat, startLng),
        new kakao.maps.LatLng(lat, lng)
    ];
    polyline = new kakao.maps.Polyline({
        path: linePath, strokeWeight: 5, strokeColor: '#FFAE00', strokeOpacity: 0.7, strokeStyle: 'solid'
    });
    polyline.setMap(map);
    alert(shelterName + " (으)로 길안내를 시작합니다.");
};

// 3. 마커 찍기 (파이썬에서 데이터 받아서 호출됨)
window.initMarkers = function(shelterData) {
    if (!map) return;
    shelterData.forEach(function(s) {
        var marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(s.lat, s.lng),
            map: map
        });
        kakao.maps.event.addListener(marker, 'click', function() {
            window.findRoute(s.lat, s.lng, s.name);
        });
    });
};