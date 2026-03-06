// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pro 버전: 정적 내보내기 활성화 (Azure Static Web Apps 최적화)
  output: 'export',
  // Pro 버전: 빌드 속도를 위해 ESLint 경고 무시 (필요시 활성화 가능)
  // eslint: { ignoreDuringBuilds: true }, // 이 부분 지우기!
};

export default nextConfig;
