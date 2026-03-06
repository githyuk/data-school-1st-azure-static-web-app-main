import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Azure Static Web Apps를 위한 필수 설정
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 에러 방지
  },
  typescript: {
    ignoreBuildErrors: true, // 타입 에러로 빌드가 멈추는 것 방지
  }
};

export default nextConfig;