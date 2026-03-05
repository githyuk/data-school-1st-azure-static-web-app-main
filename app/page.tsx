"use client";
import { useState, useEffect } from "react";
import Script from "next/script";

// 타입스크립트 에러 방지
declare global {
  interface Window {
    kakao: any;
    initMap: any;
    initMarkers: any;
  }
}

export default function Home() {
  // === 상태 관리 ===
  const [isLogin, setIsLogin] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [showMap, setShowMap] = useState(false);

  // 날짜/시간 상태
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // 입력값
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthyear, setBirthyear] = useState("");
  const [address, setAddress] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // === 시계 기능 (1초마다 갱신) ===
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }));
      setCurrentTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // === 로그인/회원가입 로직 ===
  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: loginId, password: loginPw }),
      });
      const result = await response.json();
      if (response.ok) {
        setUserName(result.username);
        setIsLogin(true);
      } else {
        alert("로그인 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패! 인터넷 연결을 확인해주세요.");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, password, name, birthyear: Number(birthyear), address }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setIsSignupMode(false);
      } else {
        alert("가입 실패: " + result.detail);
      }
    } catch (error) {
      alert("서버 연결 실패!");
    }
  };

  // === 스타일 정의 (CSS-in-JS) ===
  const styles = {
    wrapper: { fontFamily: '"Pretendard", "Malgun Gothic", sans-serif', backgroundColor: '#F3F4F6', minHeight: '100vh', display: 'flex', justifyContent: 'center' },
    mobileContainer: { width: '100%', maxWidth: '480px', backgroundColor: '#FFFFFF', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' as const, position: 'relative' as const },
    
    // 로그인 화면
    loginBox: { padding: '40px 30px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', height: '100%' },
    logoTitle: { fontSize: '36px', fontWeight: '800', color: '#10B981', marginBottom: '10px', textAlign: 'center' as const },
    logoSub: { fontSize: '18px', color: '#6B7280', marginBottom: '40px', textAlign: 'center' as const },
    input: { width: '100%', padding: '16px', marginBottom: '12px', fontSize: '18px', border: '2px solid #E5E7EB', borderRadius: '12px', outline: 'none', transition: 'border 0.3s' },
    mainBtn: { width: '100%', padding: '18px', backgroundColor: '#10B981', color: 'white', fontSize: '20px', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' },
    subLink: { marginTop: '20px', textAlign: 'center' as const, color: '#6B7280', fontSize: '16px', cursor: 'pointer' },

    // 메인 대시보드
    topBar: { padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
    welcomeText: { fontSize: '22px', fontWeight: 'bold', color: '#1F2937' },
    logoutBtn: { padding: '8px 16px', fontSize: '14px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '20px', color: '#4B5563', cursor: 'pointer' },
    
    // 정보 카드 (날씨/시간)
    infoCard: { margin: '10px 20px 20px', padding: '25px', background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)', borderRadius: '25px', color: 'white', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)' },
    dateText: { fontSize: '18px', opacity: 0.9 },
    timeText: { fontSize: '36px', fontWeight: 'bold', margin: '5px 0' },
    weatherRow: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '15px', width: 'fit-content' },
    
    // 메인 액션 버튼들
    actionContainer: { flex: 1, padding: '0 20px', display: 'flex', flexDirection: 'column' as const, gap: '15px' },
    bigButton: { 
        padding: '35px 20px', backgroundColor: '#ECFDF5', border: '2px solid #10B981', 
        borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '20px',
        cursor: 'pointer', transition: 'transform 0.1s', boxShadow: '0 4px 0 #10B981'
    },
    bigBtnIcon: { fontSize: '40px', backgroundColor: '#fff', padding: '10px', borderRadius: '50%' },
    bigBtnTitle: { fontSize: '24px', fontWeight: 'bold', color: '#065F46', display: 'block' },
    bigBtnDesc: { fontSize: '16px', color: '#059669', marginTop: '5px' },

    emergencyBtn: {
        marginTop: 'auto', marginBottom: '30px', padding: '20px', backgroundColor: '#FEF2F2', border: '2px solid #EF4444',
        borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        color: '#B91C1C', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer'
    },

    // 하단 탭
    bottomNav: { height: '70px', borderTop: '1px solid #E5E7EB', display: 'flex', backgroundColor: '#fff' },
    navItem: { flex: 1, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#6B7280', cursor: 'pointer' },
    activeNav: { color: '#10B981', fontWeight: 'bold' }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.mobileContainer}>
        
        {/* ================= 1. 로그인 전 ================= */}
        {!isLogin && (
          <div style={styles.loginBox}>
            <div style={{fontSize: '60px', textAlign: 'center', marginBottom: '10px'}}>👵👴</div>
            <div style={styles.logoTitle}>세이프 패스</div>
            <div style={styles.logoSub}>어르신을 위한 쉼터 안내 도우미</div>

            {!isSignupMode ? (
              <>
                <input type="text" placeholder="아이디" style={styles.input} onChange={(e) => setLoginId(e.target.value)} />
                <input type="password" placeholder="비밀번호" style={styles.input} onChange={(e) => setLoginPw(e.target.value)} />
                <button onClick={handleLogin} style={styles.mainBtn}>로그인</button>
                <div style={styles.subLink} onClick={() => setIsSignupMode(true)}>
                  아직 회원이 아니신가요? <b>회원가입</b>
                </div>
              </>
            ) : (
              <>
                <input type="text" placeholder="아이디" style={styles.input} onChange={(e) => setUserid(e.target.value)} />
                <input type="password" placeholder="비밀번호" style={styles.input} onChange={(e) => setPassword(e.target.value)} />
                <input type="text" placeholder="성함 (예: 홍길동)" style={styles.input} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="출생연도 (예: 1950)" style={styles.input} onChange={(e) => setBirthyear(e.target.value)} />
                <input type="text" placeholder="사시는 곳 (예: 혜화동)" style={styles.input} onChange={(e) => setAddress(e.target.value)} />
                <button onClick={handleSignup} style={{...styles.mainBtn, backgroundColor: '#3B82F6', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'}}>가입하기</button>
                <div style={styles.subLink} onClick={() => setIsSignupMode(false)}>
                  로그인 화면으로 돌아가기
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= 2. 로그인 후 메인 ================= */}
        {isLogin && !showMap && (
          <>
            {/* 상단바 */}
            <div style={styles.topBar}>
              <div style={styles.welcomeText}>{userName}님, 반갑습니다! 👋</div>
              <button onClick={() => setIsLogin(false)} style={styles.logoutBtn}>로그아웃</button>
            </div>

            {/* 정보 카드 (날씨/시간) */}
            <div style={styles.infoCard}>
              <div style={styles.dateText}>{currentDate}</div>
              <div style={styles.timeText}>{currentTime}</div>
              <div style={styles.weatherRow}>
                <span style={{fontSize: '24px'}}>☀️</span>
                <span style={{fontWeight: 'bold', fontSize: '18px'}}>맑음 24°C</span>
                <span style={{fontSize: '14px', marginLeft: '10px', opacity: 0.8}}>미세먼지 좋음</span>
              </div>
            </div>

            {/* 메인 버튼들 */}
            <div style={styles.actionContainer}>
              <div style={{fontSize: '20px', fontWeight: 'bold', color: '#374151', margin: '10px 0 5px'}}>
                무엇을 도와드릴까요?
              </div>

              {/* 길찾기 버튼 (가장 크게) */}
              <button style={styles.bigButton} onClick={() => setShowMap(true)}>
                <div style={styles.bigBtnIcon}>🏃</div>
                <div style={{textAlign: 'left'}}>
                  <span style={styles.bigBtnTitle}>가까운 쉼터 찾기</span>
                  <div style={styles.bigBtnDesc}>지도로 가장 빠른 길을 안내합니다</div>
                </div>
              </button>

              {/* 119 긴급전화 */}
              <button style={styles.emergencyBtn} onClick={() => alert("119로 연결합니다. (시뮬레이션)")}>
                <span style={{fontSize: '24px'}}>🚨</span> 119 긴급 전화 연결
              </button>
            </div>

            {/* 하단 탭 */}
            <div style={styles.bottomNav}>
              <div style={{...styles.navItem, ...styles.activeNav}}>
                <span style={{fontSize: '24px'}}>🏠</span>
                <span>홈</span>
              </div>
              <div style={styles.navItem}>
                <span style={{fontSize: '24px'}}>👤</span>
                <span>내 정보</span>
              </div>
            </div>
          </>
        )}

        {/* ================= 3. 지도 화면 ================= */}
        {isLogin && showMap && (
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 50, backgroundColor: 'white' }}>
            
            {/* 지도 헤더 */}
            <div style={{padding: '15px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', backgroundColor: 'white', position: 'absolute', top: 0, width: '100%', zIndex: 60}}>
              <button onClick={() => setShowMap(false)} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '15px'}}>⬅</button>
              <span style={{fontSize: '20px', fontWeight: 'bold'}}>주변 쉼터 안내</span>
            </div>

            {/* 지도 영역 */}
            <div id="map" style={{ width: '100%', height: '100%', paddingTop: '60px' }}></div>
            
            {/* 하단 안내 메시지 박스 */}
            <div id="subtitle-box" style={{
                position: 'absolute', bottom: '30px', left: '20px', right: '20px',
                backgroundColor: 'rgba(33, 33, 33, 0.9)', color: '#FFD700',
                padding: '20px', borderRadius: '15px', fontSize: '20px', 
                textAlign: 'center', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 60
            }}>
                지도에 보이는 쉼터를 눌러보세요!
            </div>

            {/* 스크립트 로드 */}
            <Script 
                src="//dapi.kakao.com/v2/maps/sdk.js?appkey=53573d8bf722b4bc75ea45fd95a4ed3c&libraries=services&autoload=false"
                onLoad={() => {
                window.kakao.maps.load(() => {
                    if (window.initMap) window.initMap();
                    fetch("/api/shelters")
                    .then(res => res.json())
                    .then(data => {
                        if(window.initMarkers) window.initMarkers(data);
                    });
                });
                }}
            />
            <Script src="/map_upgrade.js" strategy="afterInteractive" />
          </div>
        )}

      </div>
    </div>
  );
}
