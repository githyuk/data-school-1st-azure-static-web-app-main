'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// 카카오 지도를 불러오기 위한 dynamic import (SSR 방지)
const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
});

export default function Home() {
  const [showMap, setShowMap] = useState(false); // 지도 표시 상태
  const [userName, setUserName] = useState<string | null>(null); // 사용자 이름 (로그인 시)

  return (
    <div style={styles.wrapper}>
      {/* 1. 상단 바: 시간 및 로그인 버튼 */}
      <div style={styles.header}>
        <div style={styles.time}>오전 10:30</div>
        {/* 로그인 전: '로그인' 버튼 표시 */}
        {!userName && <button style={styles.loginBtn}>로그인</button>}
        {/* 로그인 후: '사용자 이름' 및 '로그아웃' 버튼 표시 */}
        {userName && (
          <div style={styles.userInfo}>
            <span style={styles.userName}>{userName}님 반갑습니다! 👋</span>
            <button style={styles.logoutBtn} onClick={() => setUserName(null)}>
              로그아웃
            </button>
          </div>
        )}
      </div>

      {/* 2. 메인 콘텐츠 area */}
      <div style={styles.content}>
        {/* 날씨 카드 */}
        <div style={styles.weatherCard}>
          <div style={styles.weatherInfo}>
            <span style={styles.weatherIcon}>☀️</span>
            <span style={styles.weatherText}>맑음</span>
          </div>
          <div style={styles.temperature}>
            <span style={styles.tempValue}>24</span>
            <span style={styles.tempUnit}>°C</span>
          </div>
          <div style={styles.weatherDesc}>
            오늘 산책하기 참 좋은 날씨예요!
          </div>
        </div>

        {/* 길찾기 버튼 */}
        {!showMap && (
          <button style={styles.pathBtn} onClick={() => setShowMap(true)}>
            <span style={styles.pathIcon}>📍</span>
            <span style={styles.pathText}>길찾기</span>
            <div style={styles.pathDesc}>대피소 및 쉼터를 찾아보세요</div>
          </button>
        )}

        {/* 지도 표시 */}
        {showMap && (
          <div style={styles.mapWrapper}>
            <MapComponent />
            <button style={styles.closeMapBtn} onClick={() => setShowMap(false)}>
              지도 닫기
            </button>
          </div>
        )}
      </div>

      {/* 3. 하단 내비게이션 바 */}
      <div style={styles.footer}>
        <div style={styles.navItemActive}>
          <span style={styles.navIconActive}>🏠</span>
          <span style={styles.navTextActive}>홈</span>
        </div>
        <div style={styles.navItem}>
          <span style={styles.navIcon}>👤</span>
          <span style={styles.navText}>내 정보</span>
        </div>
      </div>
    </div>
  );
}

// 어르신들을 위한 효도형 고대비 CSS 세트
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    fontFamily: '"Pretendard", sans-serif',
    backgroundColor: '#F3F4F6',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#1F2937',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  time: { fontSize: '18px', fontWeight: 'bold' },
  loginBtn: {
    padding: '10px 20px',
    backgroundColor: '#10B981', // 초록색 버튼
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#EF4444', // 빨간색 버튼
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  weatherCard: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  weatherInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  weatherIcon: { fontSize: '64px' }, // 거대 아이콘
  weatherText: { fontSize: '24px', fontWeight: 'bold' },
  temperature: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  tempValue: { fontSize: '80px', fontWeight: 'bold' }, // 거대 폰트
  tempUnit: { fontSize: '32px', marginTop: '16px' },
  weatherDesc: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#4B5563',
  },
  pathBtn: {
    backgroundColor: '#FBBF24', // 노란색 버튼
    color: '#1F2937',
    padding: '32px',
    border: 'none',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    width: '100%',
  },
  pathIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '16px',
  },
  pathText: {
    fontSize: '28px',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '12px',
  },
  pathDesc: {
    fontSize: '16px',
    color: '#4B5563',
  },
  mapWrapper: {
    height: '400px',
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
  },
  closeMapBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#1F2937',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    zIndex: 10,
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: 'white',
    boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
  },
  navItem: {
    textAlign: 'center',
    color: '#9CA3AF',
    width: '100px',
  },
  navItemActive: {
    textAlign: 'center',
    color: '#10B981', // 활성화된 메뉴 색상
    width: '100px',
  },
  navIcon: {
    fontSize: '24px',
    display: 'block',
    marginBottom: '6px',
  },
  navIconActive: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '6px',
  },
  navText: { fontSize: '14px' },
  navTextActive: { fontSize: '16px', fontWeight: 'bold' },
};
