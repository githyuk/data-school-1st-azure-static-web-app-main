import React from 'react';

export default function MapComponent() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#D1D5DB', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '40px', marginBottom: '10px' }}>🗺️</div>
      <h3 style={{ margin: '0 0 10px 0' }}>지도가 여기에 표시됩니다</h3>
      <p style={{ fontSize: '14px', color: '#6B7280' }}>카카오 지도 API 연결 준비 중...</p>
    </div>
  );
}