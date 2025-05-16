async function searchNews(query: string) {
  const API_KEY = `${import.meta.env.VITE_GOOGLE_API_KEY}`;
  const SEARCH_ENGINE_ID = `${import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID}`;

  // 검색하고 싶은 뉴스 사이트들
  const newsSites = ['news.naver.com', 'v.daum.net', 'news.chosun.com'];

  // OR로 연결된 site: 필터 생성
  const siteFilter = '(' + newsSites.map(site => 'site:' + site).join(' OR ') + ')';
  const fullQuery = query + ' ' + siteFilter;

  try {
    const URL =
      'https://www.googleapis.com/customsearch/v1?' +
      'key=' +
      API_KEY +
      '&cx=' +
      SEARCH_ENGINE_ID +
      '&q=' +
      encodeURIComponent(fullQuery) +
      '&num=10' + // 결과 10개
      '&lr=lang_ko' + // 한국어 결과
      '&sort=date'; // 날짜순 정렬

    const response = await fetch(URL);
    const data = await response.json();

    console.log('검색 결과:', data);

    // 결과가 있는지 확인
    if (data.items && data.items.length > 0) {
      console.log('찾은 뉴스 개수:', data.items.length);
      return data.items;
    } else {
      console.log('검색 결과가 없습니다.');
      return [];
    }
  } catch (error) {
    console.error('검색 오류:', error);
    return [];
  }
}

// 실행
searchNews('롯데 자이언츠');
