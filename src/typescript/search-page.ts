import { naverNews } from './naverapi.ts';
import type { NaverNewsItem } from './naverapi.ts';

const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000';

// 검색 함수 생성
async function searchNews(keyword: string) {
  // 유효한 검색어 확인
  if (!keyword.trim()) {
    showEmptyState();
    return;
  }

  // 로딩 상태 표시
  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = '<div class="col-span-full py-8 text-center">검색 중...</div>';
  }

  try {
    // 네이버 API로 뉴스 검색
    const articles: NaverNewsItem[] | undefined = await naverNews(keyword, 21);

    // 결과 표시
    displayNews(articles, keyword);
  } catch (error) {
    console.error('뉴스 검색 오류:', error);
    if (newsGrid) {
      newsGrid.innerHTML = '<div class="col-span-full py-8 text-center text-red-500">검색 중 오류가 발생했습니다.</div>';
    }
  }
}

// 빈 상태(검색 전) 표시 함수
function showEmptyState() {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  // 그리드 초기화
  newsGrid.innerHTML = `
    <div class="col-span-full py-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h2 class="text-xl font-medium text-gray-500 mb-2">검색어를 입력해주세요</h2>
      <p class="text-gray-400">검색창에 키워드를 입력하고 검색 버튼을 클릭하세요.</p>
    </div>
  `;

  // 헤더 제목 원래대로 복원
  const newsHeader = document.querySelector('main h1');
  if (newsHeader) {
    newsHeader.textContent = '뉴스 검색';
  }
}

// 뉴스 카드 렌더링 함수
const renderCard = (article: NaverNewsItem, keyword: string) => {
  const card = document.createElement('a');
  card.href = article.link;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.className = 'flex flex-col rounded-lg overflow-hidden shadow-md bg-white h-full transition-transform hover:scale-[1.01]';

  card.innerHTML = `
  <div class="relative h-40 overflow-hidden">
    <img src="${article.image || fallbackImage}" alt="${article.title}"
      class="w-full h-full object-cover"
      onerror="this.src='${fallbackImage}'"
    />
    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent ">
      <div class="flex justify-between items-center">
        <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md">${keyword}</span>
        <span class="text-xs text-white">${article.pubDate}</span>
      </div>
      <h3 class="text-white font-bold mt-1 line-clamp-2 h-[45px]">${article.title}</h3>
    </div>
  </div>
  <div class="p-4 flex flex-col flex-grow">
    <p class="text-sm text-gray-700 mb-4 flex-grow">${article.description}</p>
    <span class="text-blue-500 text-sm flex items-center hover:underline">
      자세히 보기 →
    </span>
  </div>
  `;

  return card;
};

// 검색 결과 표시 함수
function displayNews(articles: NaverNewsItem[] | undefined, keyword: string) {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  // 그리드 초기화
  newsGrid.innerHTML = '';

  // 검색 결과가 없는 경우
  if (!articles || articles.length === 0) {
    newsGrid.innerHTML = `<div class="col-span-full py-8 text-center">
      <h2 class="text-lg font-medium text-gray-600 mb-2">'${keyword}'에 대한 검색 결과가 없습니다.</h2>
      <p class="text-gray-500">다른 검색어로 다시 시도해 보세요.</p>
    </div>`;
    return;
  }

  // 뉴스 카드 추가
  articles.forEach(article => {
    newsGrid.appendChild(renderCard(article, keyword));
  });

  // 헤더 제목 업데이트
  const newsHeader = document.querySelector('main h1');
  if (newsHeader) {
    newsHeader.textContent = `'${keyword}' 검색 결과`;
  }
}

// 문서 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', () => {
  // 페이지 로드 시 초기 상태 표시
  showEmptyState();

  // 검색 폼에 이벤트 리스너 추가
  const searchForm = document.querySelector('form');
  const searchInput = document.getElementById('search') as HTMLInputElement;

  // 폼 제출 이벤트 처리
  if (searchForm) {
    searchForm.addEventListener('submit', event => {
      event.preventDefault();

      if (searchInput) {
        const keyword = searchInput.value.trim();
        searchNews(keyword);
      }
    });
  }
});

// 웹 접근성을 위한 엔터키 이벤트 처리 (폼 제출과 중복될 수 있으나 안전을 위해 추가)
const searchInput = document.getElementById('search') as HTMLInputElement;
if (searchInput) {
  searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const keyword = searchInput.value.trim();
      searchNews(keyword);
    }
  });
}
