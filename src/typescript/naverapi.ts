import axios from 'axios';

const clientId = `${import.meta.env.VITE_NAVER_CLIENT_ID}`;
const clientSecret = `${import.meta.env.VITE_NAVER_CLIENT_SECRET}`;

async function naverNews() {
  const keyword = '롯데자이언츠';
  const URL = `https://fesp-api.koyeb.app/proxy/v1/search/news.json?query=${keyword}`;

  try {
    const response = await axios.get(URL, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'X-Target-Url': 'https://openapi.naver.com',
      },
    });

    console.log('전체 응답:', response.data);
    console.log('뉴스 아이템:', response.data.items);
  } catch (error) {
    console.error('에러 발생:', error);
  }
}

naverNews();
