// 뉴스 아이템 타입 정의
interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate?: string;
}

// 뉴스 데이터 타입 정의
// interface NewsData {
//   items: NewsItem[];
// }

// 연합뉴스 피드 가져오기
async function getNews(): Promise<void> {
  const URL = `https://api.allorigins.win/get?url=${encodeURIComponent('http://www.yonhapnewstv.co.kr/browse/feed/')}`;

  try {
    // 데이터 가져오기
    const response = await fetch(URL);

    // 성공했는지 확인
    if (!response.ok) {
      throw new Error('뉴스를 가져오지 못했습니다');
    }

    // XML 텍스트로 변환
    const xmlText = await response.text();
    // XML 파싱
    const newsItems = parseRSS(xmlText);
    // const newsItems = await response.json();
    console.log(newsItems);
  } catch (error) {
    // 에러 났을 때
    console.error('에러 발생:', error);
  }
}

/**
 * xml을 json으로 파싱해주는 함수
 * @param xmlText
 * @returns
 */
function parseRSS(xmlText: string): NewsItem[] {
  const items: NewsItem[] = [];

  // split을 사용한 더 간단한 방법
  const itemSections = xmlText.split('<item>');

  // 첫 번째 요소는 <item> 이전 내용이므로 제외
  for (let i = 1; i < itemSections.length; i++) {
    const itemContent = itemSections[i].split('</item>')[0];

    // 제목 추출
    const titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
    const title = titleMatch
      ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/, '$1')
      : '';

    // 링크 추출
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
    const link = linkMatch ? linkMatch[1] : '';

    if (title && link) {
      items.push({
        title,
        description: '', // 간단하게 처리
        link,
        pubDate: '',
      });
    }
  }

  return items;
}

getNews();
