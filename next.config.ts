import type { NextConfig } from "next";

// ⚠️ 핵심: ': NextConfig' 대신 ': any'를 써서 타입 검사를 강제로 끕니다.
const nextConfig: any = {
  output: 'export',  // Azure 배포를 위한 핵심 설정
  eslint: {
    ignoreDuringBuilds: true, // 에러 무시 설정
  },
  images: {
    unoptimized: true, // 이미지 최적화 끄기
  },
};

export default nextConfig;
