'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// 🏆 Pro 버전: @/ 경로를 사용하여 빌드 오류를 방지합니다.
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div style={styles.loading}>지도를 불러오는 중...</div>
});

export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.time}>오전 10:30</div>
        {!userName && <button style={styles.loginBtn}>로그인</button>}
        {userName && (
          <div style={styles.userInfo}>
            <span style={styles.userName}>{userName}님 반갑습니다! 👋</span>
            <button style={styles.logoutBtn} onClick={() => setUserName(null)}>로그아웃</button>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.weatherCard}>
          <div style={styles.weatherInfo}>
            <span style={styles.weatherIcon}>☀️</span>
            <span style={styles.weatherText}>맑음</span>
          </div>
          <div style={styles.temperature}>
            <span style={styles.tempValue}>24</span>
            <span style={styles.tempUnit}>°C</span>
          </div>
          <p style={styles.weatherDesc}>오늘 산책하기 참 좋은 날씨예요!</p>
        </div>

        {!showMap && (
          <button style={styles.pathBtn} onClick={() => setShowMap(true)}>
            <span style={styles.pathIcon}>📍</span>
            <span style={styles.pathText}>길찾기</span>
            <div style={styles.pathDesc}>대피소 및 쉼터를 찾아보세요</div>
          </button>
        )}

        {showMap && (
          <div style={styles.mapWrapper}>
            <MapComponent />
            <button style={styles.closeMapBtn} onClick={() => setShowMap(false)}>닫기</button>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <div style={styles.navItemActive}>🏠<br/><span style={{fontSize:'12px'}}>홈</span></div>
        <div style={styles.navItem}>👤<br/><span style={{fontSize:'12px'}}>내 정보</span></div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: { fontFamily: 'Pretendard, sans-serif', backgroundColor: '#F3F4F6', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'white' },
  time: { fontSize: '18px', fontWeight: 'bold' },
  loginBtn: { padding: '10px 20px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
  content: { flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  weatherCard: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  weatherIcon: { fontSize: '50px' },
  weatherText: { fontSize: '20px', fontWeight: 'bold', marginLeft: '10px' },
  temperature: { display: 'flex', justifyContent: 'center', alignItems: 'flex-start', margin: '10px 0' },
  tempValue: { fontSize: '70px', fontWeight: 'bold' },
  tempUnit: { fontSize: '24px', marginTop: '15px' },
  pathBtn: { backgroundColor: '#FBBF24', padding: '30px', border: 'none', borderRadius: '16px', cursor: 'pointer' },
  pathIcon: { fontSize: '40px' },
  pathText: { fontSize: '24px', fontWeight: 'bold', display: 'block' },
  mapWrapper: { height: '350px', position: 'relative', borderRadius: '16px', overflow: 'hidden' },
  closeMapBtn: { position: 'absolute', top: '10px', right: '10px', padding: '8px', zIndex: 10, borderRadius: '5px', border: 'none' },
  footer: { display: 'flex', justifyContent: 'space-around', padding: '15px', backgroundColor: 'white' },
  navItemActive: { color: '#10B981', textAlign: 'center', fontWeight: 'bold' },
  navItem: { color: '#9CA3AF', textAlign: 'center' },
  loading: { height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E7EB', borderRadius: '16px' }
};