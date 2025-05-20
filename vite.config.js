import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const naverapi = 'https://openapi.naver.com';
// ESM에서 __dirname 대체하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// findAllHtmlFiles 함수 정의 추가
function findAllHtmlFiles(directory) {
  const htmlFiles = {};

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.html')) {
        // 키 이름을 경로에서 추출 (확장자 제외)
        const key = path.relative(__dirname, filePath).replace('.html', '');
        htmlFiles[key] = filePath;
      }
    }
  }
  scanDirectory(directory);
  return htmlFiles;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        ...findAllHtmlFiles(path.resolve(__dirname, 'src')),
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
