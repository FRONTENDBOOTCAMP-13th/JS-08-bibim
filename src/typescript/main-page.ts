import { naverNews } from './naverapi.ts';
import type { NaverNewsItem } from './naverapi.ts';
import { updatePoint } from './updatePoint.ts';
import { renderPoint } from './updatePoint.ts';
import { updateCalendar } from './toggle-menu.ts';

/**
 * 현재 선택된 뉴스 카테고리 또는 검색어
 * @type {string}
 */
let keyword = '';

/**
 * 기사 발행 시간과 현재 시간의 차이를 계산하여 점의 색상과 툴팁 메시지를 결정
 * @param {string} pubDate - 기사 발행 시간 (예: "Sun, 18 May 2025 02:02:00 +0900")
 * @returns {{ color: string, tooltip: string }} 색상 hexcode와 툴팁 메시지
 */
const getTimeIndicator = (pubDate: string): { color: string; tooltip: string } => {
  try {
    // 발행 시간을 Date 객체로 변환
    const publishedDate = new Date(pubDate);
    // 현재 시간
    const currentDate = new Date();

    // 발행 시간과 현재 시간의 차이 (밀리초)
    const timeDifference = currentDate.getTime() - publishedDate.getTime();

    // 시간 차이를 시간 단위로 변환
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // 1시간 이내
    if (hoursDifference <= 1) {
      return {
        color: '#dc2626', // 빨간색 (red-600)
        tooltip: '1시간 이내 발행된 최신 기사',
      };
    }
    // 24시간 이내
    else if (hoursDifference <= 24) {
      return {
        color: '#f97316', // 주황색 (orange-500)
        tooltip: '24시간 이내 발행된 기사',
      };
    }
    // 그 외
    else {
      return {
        color: '#ffffff', // 흰색
        tooltip: '24시간 이전에 발행된 기사',
      };
    }
  } catch (error) {
    console.error('날짜 파싱 오류:', error, pubDate);
    return {
      color: '#ffffff', // 오류 시 기본값은 흰색
      tooltip: '발행 시간을 확인할 수 없음',
    };
  }
};

/**
 * 객체가 NaverNewsItem 타입인지 확인하는 타입 가드 함수
 * @param item - 확인할 항목
 * @returns 항목이 NaverNewsItem 타입인지 여부
 */
function isNaverNewsItem(item: unknown): item is NaverNewsItem {
  return item !== null && typeof item === 'object' && 'link' in item && typeof (item as Record<string, unknown>).link === 'string';
}

let arrQuiz = [] as { title: string; description: string; date: string; link: string }[];

/**
 * 뉴스 기사를 시각적으로 표시하는 카드 요소 생성
 * @param {NaverNewsItem} article - 표시할 뉴스 기사 정보
 * @returns {HTMLElement} 생성된 뉴스 카드 요소
 */
const renderCard = (article: NaverNewsItem) => {
  // 발행 시간에 따른 점 색상과 툴팁 결정
  const { color: dotColor, tooltip: dotTooltip } = getTimeIndicator(article.pubDate);

  // 히스토리에서 현재 기사가 있는지 확인
  const history = JSON.parse(localStorage.getItem('history') || '[]') as unknown[];
  const isInHistory = history.some(item => isNaverNewsItem(item) && item.link === article.link);

  // article 요소 생성 (시맨틱하게 뉴스 콘텐츠를 나타냄)
  const card = document.createElement('article');

  // 히스토리에 있으면 배경색을 gray-300, 아니면 white로 설정
  const bgColorClass = isInHistory ? 'bg-gray-300' : 'bg-white';

  card.className = `relative flex flex-col rounded-lg overflow-hidden shadow-md ${bgColorClass} h-full transition-transform hover:scale-[1.01]`;
  card.setAttribute('tabindex', '0'); // 키보드 포커스 가능하도록 설정

  // 웹 접근성 향상을 위한 속성 추가
  if (isInHistory) {
    card.setAttribute('aria-label', '읽은 기사');
  }

  // 히스토리에 있는 기사는 헤더 배경을 비활성화된 연한 회색(bg-gray-400)으로 설정
  const headerBgClass = isInHistory ? 'bg-gray-400' : 'bg-blue-500';

  card.innerHTML = `
  <div class="relative h-40 overflow-hidden ${headerBgClass}">
    <div 
      class="w-[15px] h-[15px] absolute top-3 left-4 rounded-full cursor-help" 
      style="background-color: ${dotColor};"
      title="${dotTooltip}"
      role="tooltip"
      aria-label="${dotTooltip}"
    ></div>
    
    <!-- 하트 아이콘 - 버튼으로 변경 -->
    <button 
      class="absolute top-3 right-4 z-10 bg-transparent border-0 p-0 favorite-button"
      aria-label="즐겨찾기에 추가"
      title="즐겨찾기에 추가"
      data-article-id="${article.link}"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        class="favorite-icon drop-shadow-md hover:scale-125 transition-transform duration-300"
      >
        <path d="M12 21c-7-4-10.5-8.5-10.5-12.5C1.5,5,4,2.5,7.5,2.5c2,0,4,1,4.5,3.5c0.5-2.5,2.5-3.5,4.5-3.5c3.5,0,6,2.5,6,6C22.5,12.5,19,17,12,21z"/>
      </svg>
    </button>
    
    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
      <div class="flex justify-between items-center">
        <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md">${keyword}</span>
        <time class="text-xs text-white" datetime="${article.pubDate}">${article.pubDate}</time>
      </div>
      <h3 class="text-white font-bold mt-1 line-clamp-2 h-[45px]">${article.title}</h3>
    </div>
  </div>
  <div class="p-4 flex flex-col flex-grow">
    <p class="text-sm text-gray-700 mb-4 flex-grow">${article.description}</p>
    
    <!-- 자세히 보기와 퀴즈 풀러가기 버튼 -->
    <div class="flex justify-between items-center">
      <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="text-blue-500 text-sm flex items-center hover:underline read-more-link">
        자세히 보기 →
      </a>
      <button class="text-green-500 text-sm flex items-center cursor-pointer hover:underline quiz-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        퀴즈 풀러가기
      </button>
    </div>
  </div>
  `;

  if (arrQuiz.length < 10) {
    arrQuiz.push({ title: article.title, description: article.description, date: article.pubDate, link: article.link });
  }

  // 카드 클릭 이벤트 , 안의 세부a태그를 클릭했을경우 카드 전체를 클릭한경우와 중복되지 않도록 처리해줌
  card.addEventListener('click', event => {
    // 이미 버튼이나 링크 클릭 이벤트가 처리 중이면 카드 클릭 무시
    if ((event.target as HTMLElement).closest('a') || (event.target as HTMLElement).closest('button')) {
      return;
    }

    // 히스토리에 기사 추가
    const isDuplicate = history.some(item => isNaverNewsItem(item) && item.link === article.link);

    if (!isDuplicate) {
      history.push(article);
      localStorage.setItem('history', JSON.stringify(history));

      // UI 업데이트 - 배경색 변경
      card.classList.remove('bg-white');
      card.classList.add('bg-gray-300');

      // 헤더 배경 색상도 업데이트 - 파란색에서 연한 회색으로
      const headerElement = card.querySelector('div.relative.h-40');
      if (headerElement) {
        headerElement.classList.remove('bg-blue-500');
        headerElement.classList.add('bg-gray-400');
      }

      // 웹 접근성을 위한 aria-label 추가
      card.setAttribute('aria-label', '읽은 기사');

      // 스크린 리더 사용자를 위한 알림
      const srAnnouncement = document.createElement('span');
      srAnnouncement.className = 'sr-only';
      srAnnouncement.setAttribute('aria-live', 'polite');
      srAnnouncement.textContent = '기사를 읽음 처리했습니다.';
      document.body.appendChild(srAnnouncement);

      // 잠시 후 알림 요소 제거
      setTimeout(() => {
        if (document.body.contains(srAnnouncement)) {
          document.body.removeChild(srAnnouncement);
        }
      }, 1000);
    }

    // 자세히 보기 링크로 이동
    window.open(article.link, '_blank', 'noopener,noreferrer');
  });

  // 키보드 접근성을 위한 Enter 키 이벤트, 내부요소가 아니라 카드 전체에 포커스되어 있을 경우에만 동작
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !(event.target as HTMLElement).closest('a, button')) {
      window.open(article.link, '_blank', 'noopener,noreferrer');
    }
  });

  const bookMark = JSON.parse(localStorage.getItem('bookMark') || '[]');
  // 즐겨찾기 버튼 이벤트 리스너 추가, 즐겨찾기 기능 추가 예정
  const favoriteButton = card.querySelector('.favorite-button');
  const favoriteIcon = favoriteButton?.querySelector('.favorite-icon');
  for (let i = 0; i < bookMark.length; i++) {
    if (bookMark[i][0] === article.link) {
      favoriteIcon?.setAttribute('fill', 'white');
    }
  }

  const section = document.getElementById('article-panel');
  favoriteButton?.addEventListener('click', event => {
    const bookMark = JSON.parse(localStorage.getItem('bookMark') || '[]');
    event.preventDefault();
    event.stopPropagation();

    const isFavorite = favoriteIcon?.getAttribute('fill') === 'white'; //하트의 fill 속성이 "white"면 이미 즐겨찾기 되어 있는 상태로 판단

    if (isFavorite) {
      // 즐겨찾기 해제
      favoriteIcon?.setAttribute('fill', 'none');
      favoriteButton.setAttribute('aria-label', '즐겨찾기에 제거');
      favoriteButton.setAttribute('title', '즐겨찾기에 제거');

      // 북마크에서 해당 기사 제거
      for (let i = 0; i < bookMark.length; i++) {
        if (bookMark[i][0] === article.link) {
          bookMark.splice(i, 1); // 배열에서 제거
          localStorage.setItem('bookMark', JSON.stringify(bookMark));

          const section = document.querySelector('#article-panel');
          const targetDiv = section?.querySelector(`[data-link="${article.link}"]`);
          if (targetDiv) {
            section?.removeChild(targetDiv);
          }

          break;
        }
      }

      // 변경된 북마크 저장
      localStorage.setItem('bookMark', JSON.stringify(bookMark));
    } else {
      // 즐겨찾기 추가
      favoriteIcon?.setAttribute('fill', 'white');
      favoriteButton.setAttribute('aria-label', '즐겨찾기에서 추가');
      favoriteButton.setAttribute('title', '즐겨찾기에서 추가');
      const arr = [] as string[];
      arr.push(article.link);
      arr.push(article.title);
      arr.push(article.pubDate);

      bookMark.push(arr);
      localStorage.setItem('bookMark', JSON.stringify(bookMark));

      const linkElem = document.createElement('a');

      const txt = document.createElement('textarea');
      txt.innerHTML = article.title;
      const decoded = txt.value;

      // <b>와 </b> 태그만 제거
      const cleanText = decoded.replace(/<\/?b>/g, '');

      // 텍스트 노드로 변환
      const title = document.createTextNode(cleanText);

      const dateElem = document.createElement('span');
      const date = document.createTextNode(article.pubDate);

      linkElem.setAttribute('href', article.link);
      linkElem.setAttribute('target', '_blank');
      linkElem.setAttribute('rel', 'noopener noreferrer');
      linkElem.appendChild(title);
      linkElem.className = 'text-sm text-gray-900 hover:underline block';

      dateElem.appendChild(date);
      dateElem.className = 'text-xs text-gray-500';

      // 감싸기 시작
      const innerDiv = document.createElement('div');
      const midDiv = document.createElement('div');
      const outerDiv = document.createElement('div');
      outerDiv.setAttribute('data-link', article.link);

      midDiv.className = 'flex justify-between items-start';
      outerDiv.className = 'py-2 px-4 border-b border-gray-100';

      innerDiv.appendChild(linkElem);
      innerDiv.appendChild(dateElem);
      midDiv.appendChild(innerDiv);

      const deleteBtn = document.createElement('button');
      deleteBtn.setAttribute('type', 'button');
      deleteBtn.setAttribute('class', 'cursor-pointer');
      deleteBtn.setAttribute('class', 'delete-btn');
      deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /> </svg>`;

      deleteBtn.addEventListener('click', () => {
        // 즐겨찾기 해제
        favoriteIcon?.setAttribute('fill', 'none');
        favoriteButton.setAttribute('aria-label', '즐겨찾기에 제거');
        favoriteButton.setAttribute('title', '즐겨찾기에 제거');

        // 북마크에서 해당 기사 제거
        for (let i = 0; i < bookMark.length; i++) {
          if (bookMark[i][0] === article.link) {
            bookMark.splice(i, 1); // 배열에서 제거
            localStorage.setItem('bookMark', JSON.stringify(bookMark));

            const section = document.querySelector('#article-panel');
            const targetDiv = section?.querySelector(`[data-link="${article.link}"]`);
            if (targetDiv) {
              section?.removeChild(targetDiv);
            }

            break;
          }
        }

        // 변경된 북마크 저장
        localStorage.setItem('bookMark', JSON.stringify(bookMark));
      });
      midDiv.appendChild(deleteBtn);
      outerDiv.append(midDiv);

      // 최종 반영
      section?.appendChild(outerDiv);
    }

    // 즐겨찾기 상태 저장 로직
  });

  // 퀴즈 풀러 가기
  const quizBtn = card.querySelector('.quiz-button');
  quizBtn?.addEventListener('click', () => {
    const quizStorage = JSON.parse(localStorage.getItem('quiz') || '["", ""]');
    quizStorage[0] = article.title;
    quizStorage[1] = article.description;
    quizStorage[2] = arrQuiz;
    localStorage.setItem('quiz', JSON.stringify(quizStorage));

    window.location.href = '/src/pages/quiz.html';
  });

  return card;
};

/**
 * 페이지 초기 상태 설정 (카테고리 미선택 상태)
 * 뉴스 그리드에 안내 메시지 표시, 카테고리 버튼 비활성화, 키워드 초기화
 */
const setupInitialView = () => {
  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = '<div class="col-span-full text-center py-8">관심 있는 카테고리를 선택하거나 검색어를 입력하세요.</div>';
  }

  // 페이지 제목 업데이트
  const mainTitle = document.querySelector('main h1');
  if (mainTitle) {
    mainTitle.textContent = '뉴스 카테고리를 선택하세요';
  }

  // 모든 버튼 비활성화 상태로 설정
  const allButtons = document.querySelectorAll('.category-btn');
  allButtons.forEach(button => {
    button.classList.remove('bg-blue-600', 'text-white');
    button.setAttribute('aria-current', 'false');
  });

  // 키워드 초기화
  keyword = '';
};

/**
 * 검색어로 뉴스를 검색하고 결과 표시
 * @param {string} searchKeyword - 검색할 키워드
 * @returns {Promise<void>}
 */
const searchNews = async (searchKeyword: string): Promise<void> => {
  if (!searchKeyword.trim()) {
    setupInitialView();
    return;
  }

  // 키워드 설정
  keyword = searchKeyword;

  // 모든 카테고리 버튼 비활성화
  const allButtons = document.querySelectorAll('.category-btn');
  allButtons.forEach(button => {
    button.classList.remove('bg-blue-600', 'text-white');
    button.setAttribute('aria-current', 'false');
  });

  // 로딩 상태 표시
  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = '<div class="col-span-full text-center py-8" aria-live="polite">뉴스를 불러오는 중입니다...</div>';
  }

  // 페이지 제목 업데이트
  const mainTitle = document.querySelector('main h1');
  if (mainTitle) {
    mainTitle.textContent = `'${keyword}' 검색 결과`;
  }

  try {
    // 뉴스 데이터 가져오기
    const articles: NaverNewsItem[] | undefined = await naverNews(keyword, 30);

    // 뉴스 그리드 업데이트
    if (newsGrid) {
      // 그리드 초기화
      newsGrid.innerHTML = '';

      // 기사가 없을 경우
      if (!articles || articles.length === 0) {
        newsGrid.innerHTML = `<div class="col-span-full text-center py-8" aria-live="polite">'${keyword}'에 관한 뉴스를 찾을 수 없습니다.</div>`;
        return;
      }
      arrQuiz = [];

      // 기사 렌더링
      articles.forEach(article => {
        newsGrid.appendChild(renderCard(article));
      });

      // 스크린 리더 사용자를 위한 알림
      const srAnnouncement = document.createElement('span');
      srAnnouncement.className = 'sr-only';
      srAnnouncement.setAttribute('aria-live', 'polite');
      srAnnouncement.textContent = `${keyword}에 대한 검색 결과 ${articles.length}개를 찾았습니다.`;
      document.body.appendChild(srAnnouncement);

      // 잠시 후 알림 요소 제거
      setTimeout(() => {
        if (document.body.contains(srAnnouncement)) {
          document.body.removeChild(srAnnouncement);
        }
      }, 1000);
    }
  } catch (error) {
    console.error('뉴스를 불러오는 중 오류가 발생했습니다:', error);
    if (newsGrid) {
      newsGrid.innerHTML = '<div class="col-span-full text-center py-8 text-red-500" aria-live="assertive">뉴스를 불러오는 중 오류가 발생했습니다.</div>';
    }
  }
};

/**
 * 페이지 초기화 및 이벤트 리스너 설정
 */
document.addEventListener('DOMContentLoaded', () => {
  //먼저 초기화면 설정을 반드시 실행
  setupInitialView();
  updatePoint(10, '출석 포인트 적립');
  renderPoint();
  updateCalendar();
  // 검색 폼 이벤트 리스너 추가
  const searchForm = document.querySelector('form');
  const searchInput = document.getElementById('search') as HTMLInputElement; //타입스크립트에서 이게 input이라는 결 명시해주는 타입단언

  /**
   * 검색 폼 제출 이벤트 처리
   * @param {Event} event - 폼 제출 이벤트
   */
  searchForm?.addEventListener('submit', async event => {
    event.preventDefault(); //폼을 전송하면 새로고침이 발생하는걸 막는기능 수행행
    const searchValue = searchInput?.value.trim();

    if (searchValue) {
      await searchNews(searchValue);
    } else {
      setupInitialView();
    }
  });

  // URL에서 카테고리 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');

  if (categoryParam) {
    // URL에 카테고리가 있으면 해당 버튼 찾기
    const categoryButton = document.querySelector(`[data-category="${categoryParam}"]`) as HTMLElement;
    if (categoryButton) {
      // 버튼이 있으면 클릭 이벤트 시뮬레이션
      categoryButton.click();
    } else {
      // 카테고리가 유효하지 않으면 초기 화면 설정
      setupInitialView();
    }
  } else {
    // URL에 카테고리가 없으면 초기 화면 설정
    setupInitialView();
  }
});

// 카테고리 네비게이션 요소 가져오기
const categoryNav = document.getElementById('categoryNav');

/**
 * 카테고리 버튼 클릭 이벤트 처리
 * @param {Event} event - 클릭 이벤트
 */
categoryNav?.addEventListener('click', async event => {
  // 이벤트가 발생한 요소 확인
  const target = event.target as HTMLElement;

  // 클릭된 요소가 카테고리 버튼인지 확인
  // (버튼 자체 또는 버튼 내부 요소를 클릭했을 수 있음)
  const clickedButton = target.closest('.category-btn') as HTMLElement;

  // 버튼이 아니면 무시
  if (!clickedButton) return;

  // 카테고리를 한번 더 선택하면 원래 기본페이지로 돌아감
  if (clickedButton.classList.contains('selected')) {
    event.preventDefault();
    clickedButton.classList.remove('selected', 'bg-blue-600', 'text-white');
    clickedButton.setAttribute('aria-current', 'false');
    setupInitialView();

    // URL 초기화 추가
    const url = new URL(window.location.href);
    url.searchParams.delete('category'); // 'category' 파라미터 제거
    window.history.pushState({}, '', url);
    return;
  }
  if (clickedButton) clickedButton.classList.add('selected');

  // 기본 이벤트 방지 (링크 이동 방지)
  event.preventDefault();

  // data-category 속성 가져오기
  const category = clickedButton.getAttribute('data-category');

  // 카테고리가 없으면 무시
  if (!category) return;

  // 검색 입력창 초기화
  const searchInput = document.getElementById('search') as HTMLInputElement;
  if (searchInput) {
    searchInput.value = '';
  }

  // 키워드 설정 (카테고리 값을 그대로 키워드로 사용)
  keyword = category;

  // UI 업데이트 (동기적)
  // 1. 모든 버튼에서 활성 상태 제거
  const allButtons = document.querySelectorAll('.category-btn');
  allButtons.forEach(button => {
    button.classList.remove('bg-blue-600', 'text-white');
    button.setAttribute('aria-current', 'false');
  });

  // 2. 선택된 버튼에 활성 상태 추가
  clickedButton.classList.add('bg-blue-600', 'text-white');
  clickedButton.setAttribute('aria-current', 'page');

  // 3. 로딩 상태 표시
  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = '<div class="col-span-full text-center py-8" aria-live="polite">뉴스를 불러오는 중입니다. 조금만 기다려주세요 >_<</div>';
  }

  // 페이지 제목 업데이트
  const mainTitle = document.querySelector('main h1');
  if (mainTitle) {
    mainTitle.textContent = `${keyword} 뉴스`;
  }

  // URL 업데이트, 페이지 새로고침 없이 주소 표시줄에 파라미터업데이트, 나중에 사용자가 새로고침하거나 공유해도 카테고리 유지됌
  const url = new URL(window.location.href);
  url.searchParams.set('category', category);
  window.history.pushState({}, '', url);

  // 비동기 작업: 뉴스 데이터 가져오기
  try {
    const articles: NaverNewsItem[] | undefined = await naverNews(keyword, 30);

    // 뉴스 그리드 업데이트
    if (newsGrid) {
      // 그리드 초기화
      newsGrid.innerHTML = '';

      // 기사가 없을 경우
      if (!articles || articles.length === 0) {
        newsGrid.innerHTML = `<div class="col-span-full text-center py-8" aria-live="polite">${keyword}에 관한 뉴스를 찾을 수 없습니다.</div>`;
        return;
      }

      // 기사 렌더링
      articles.forEach(article => {
        newsGrid.appendChild(renderCard(article));
      });

      // 스크린 리더 사용자를 위한 알림
      const srAnnouncement = document.createElement('span');
      srAnnouncement.className = 'sr-only';
      srAnnouncement.setAttribute('aria-live', 'polite');
      srAnnouncement.textContent = `${keyword} 카테고리의 뉴스 ${articles.length}개를 불러왔습니다.`;
      document.body.appendChild(srAnnouncement);

      // 잠시 후 알림 요소 제거
      setTimeout(() => {
        if (document.body.contains(srAnnouncement)) {
          document.body.removeChild(srAnnouncement);
        }
      }, 1000);
    }
  } catch (error) {
    console.error('뉴스를 불러오는 중 오류가 발생했습니다:', error);
    if (newsGrid) {
      newsGrid.innerHTML = '<div class="col-span-full text-center py-8 text-red-500" aria-live="assertive">뉴스를 불러오는 중 오류가 발생했습니다.</div>';
    }
  }
});
