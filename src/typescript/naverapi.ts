import axios from 'axios';

const clientId = `${import.meta.env.VITE_NAVER_CLIENT_ID}`;
const clientSecret = `${import.meta.env.VITE_NAVER_CLIENT_SECRET}`;

// 뉴스 아이템 인터페이스 정의
export interface NaverNewsItem {
  description: string; // 뉴스 제목
  link: string; // 원본 기사 링크
  originallink: string; // 네이버 뉴스 링크
  pubDate: string; // 뉴스 내용 요약
  title: string; // 발행일
  // 필요한 경우 추가 필드
}

/**
 * 네이버 뉴스 API를 호출하여 뉴스를 가져오는 함수
 * @returns
 */
export async function naverNews(
  keyword: string,
  display: number,
): Promise<NaverNewsItem[] | undefined> {
  const URL = `https://fesp-api.koyeb.app/proxy/v1/search/news.json?query=${keyword}&display=${display}`;

  try {
    const response = await axios.get(URL, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
        'X-Target-Url': 'https://openapi.naver.com',
      },
    });

    // console.log('전체 응답:', response.data);
    // console.log('뉴스 아이템:', response.data.items);
    return response.data.items;
  } catch (error) {
    console.error('에러 발생:', error);
  }
}

naverNews('롯데 자이언츠', 3);
