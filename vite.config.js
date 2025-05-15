import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const naverapi = 'https://openapi.naver.com';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html', // 기본 index.html
        list: 'src/pages/todo/list.html', // 추가 HTML 파일
        regist: 'src/pages/todo/regist.html', // 추가 HTML 파일
        info: 'src/pages/todo/info.html', // 추가 HTML 파일
        // 필요한 다른 HTML 파일을 여기에 추가
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
  plugins: [tailwindcss()],
  server: {
    // Vite 개발서버 설정
    proxy: {
      '/naver': {
        // '/naver'로 시작하는 요청일 경우 proxy가 대신 처리
        target: naverapi,
        changeOrigin: true, // Origin 헤더를 대상 주소로 변경(localhost -> openapi.naver.com)
        rewrite: path => {
          const targetPath = path.replace('/naver', '');
          return targetPath;
        },
      },
    },
  },
});
