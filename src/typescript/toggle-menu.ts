import type { NaverNewsItem } from './naverapi.ts';

// HTML 디코딩을 위한 안전한 함수 (함수 상단에 추가)
function decodeHtmlEntities(text: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  return tempDiv.textContent || tempDiv.innerText || '';
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const openBtn = document.getElementById('open-sidebar');
  const closeBtn = document.getElementById('close-sidebar');

  const openSidebar = () => {
    sidebar?.classList.remove('translate-x-full');
    sidebar?.classList.add('translate-x-0');
    backdrop?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // 웹접근성: 사이드바 열림 상태 알림
    sidebar?.setAttribute('aria-hidden', 'false');

    // 첫 번째 포커스 가능한 요소로 포커스 이동
    const firstFocusable = sidebar?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable instanceof HTMLElement) {
      firstFocusable.focus();
    }
  };

  const closeSidebar = () => {
    sidebar?.classList.remove('translate-x-0');
    sidebar?.classList.add('translate-x-full');
    backdrop?.classList.add('hidden');
    document.body.style.overflow = '';

    // 웹접근성: 사이드바 닫힘 상태 알림
    sidebar?.setAttribute('aria-hidden', 'true');

    // 메뉴 버튼으로 포커스 복귀
    if (openBtn instanceof HTMLElement) {
      openBtn.focus();
    }
  };

  openBtn?.addEventListener('click', e => {
    e.stopPropagation();
    openSidebar();
  });

  closeBtn?.addEventListener('click', closeSidebar);
  backdrop?.addEventListener('click', closeSidebar);

  // ESC 키로 사이드바 닫기 (웹접근성)
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !sidebar?.classList.contains('translate-x-full')) {
      closeSidebar();
    }
  });

  document.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const isInsideSidebar = sidebar?.contains(target);
    const isToggleButton = openBtn?.contains(target);

    if (!isInsideSidebar && !isToggleButton && !backdrop?.classList.contains('hidden')) {
      closeSidebar();
    }
  });
});

// Toggle tab section & indicator animation
document.addEventListener('DOMContentLoaded', () => {
  const tabMypage = document.getElementById('tab-mypage') as HTMLButtonElement;
  const tabHistory = document.getElementById('tab-history') as HTMLButtonElement;
  const contentMypage = document.getElementById('tab-content-mypage');
  const contentHistory = document.getElementById('tab-content-history');
  const tabIndicator = document.getElementById('tab-indicator') as HTMLDivElement;

  const switchTab = (selected: HTMLButtonElement, deselected: HTMLButtonElement, show: HTMLElement | null, hide: HTMLElement | null) => {
    selected.classList.add('font-medium');
    selected.classList.remove('text-gray-500');
    selected.setAttribute('aria-selected', 'true'); // 웹접근성
    selected.setAttribute('tabindex', '0');

    deselected.classList.remove('font-medium');
    deselected.classList.add('text-gray-500');
    deselected.setAttribute('aria-selected', 'false'); // 웹접근성
    deselected.setAttribute('tabindex', '-1');

    show?.classList.remove('hidden');
    show?.setAttribute('aria-hidden', 'false'); // 웹접근성
    hide?.classList.add('hidden');
    hide?.setAttribute('aria-hidden', 'true'); // 웹접근성

    // 인디케이터 이동 (width 및 left 계산)
    const offsetLeft = selected.offsetLeft;
    const width = selected.offsetWidth;

    tabIndicator.style.width = `${width}px`;
    tabIndicator.style.left = `${offsetLeft}px`;
  };

  tabMypage?.addEventListener('click', () => switchTab(tabMypage, tabHistory, contentMypage, contentHistory));
  tabHistory?.addEventListener('click', () => switchTab(tabHistory, tabMypage, contentHistory, contentMypage));

  // 키보드 네비게이션 (웹접근성)
  tabMypage?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      tabHistory?.focus();
      tabHistory?.click();
    }
  });

  tabHistory?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      tabMypage?.focus();
      tabMypage?.click();
    }
  });

  // 초기 위치 설정
  window.addEventListener('load', () => {
    const activeTab = document.querySelector('#tab-mypage') as HTMLButtonElement;
    if (activeTab && tabIndicator) {
      tabIndicator.style.width = `${activeTab.offsetWidth}px`;
      tabIndicator.style.left = `${activeTab.offsetLeft}px`;

      // 초기 접근성 속성 설정
      activeTab.setAttribute('aria-selected', 'true');
      activeTab.setAttribute('tabindex', '0');
      tabHistory?.setAttribute('aria-selected', 'false');
      tabHistory?.setAttribute('tabindex', '-1');
    }
  });
});

// Toggle point section
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-point');
  const section = document.getElementById('point-section');
  const icon = document.getElementById('point-toggle-icon');
  const pointView = document.getElementById('point-view');

  const details = document.querySelector('.point-details');
  // 포인트 설정
  const points = JSON.parse(localStorage.getItem('points') || '[0]');
  if (pointView) pointView.textContent = `${points[0]} P`;

  const pointLogs = JSON.parse(localStorage.getItem('pointLog') || '[]') as {
    date: string;
    log: string;
  }[];

  const reversedLogs = pointLogs.slice().reverse();

  for (let i = 0; i < reversedLogs.length; i++) {
    if (i >= 8) break;

    const pointLog = reversedLogs[i];
    const spanElemLog = document.createElement('span');
    let logTxt;
    if (pointLog.log === `출석 포인트 적립`) {
      logTxt = document.createTextNode(pointLog.log);
    } else {
      if (pointLog.log.length > 10) {
        logTxt = document.createTextNode(`${pointLog.log.substring(0, 3)}... 퀴즈 정답`);
        spanElemLog.className = 'cursor-help'; // 마우스 커서 스타일 추가
        spanElemLog.title = pointLog.log; // 툴팁 내용 설정
        spanElemLog.setAttribute('aria-label', pointLog.log); // 웹접근성
      } else {
        logTxt = document.createTextNode(`${pointLog.log} 퀴즈 정답`);
      }
    }
    spanElemLog.appendChild(logTxt);

    const spanElemDate = document.createElement('span');
    const dateTxt = document.createTextNode(pointLog.date);
    spanElemDate.appendChild(dateTxt);
    spanElemDate.className = 'text-gray-400 ml-2 text-xs';

    const innerDiv = document.createElement('div');
    innerDiv.appendChild(spanElemLog);
    innerDiv.appendChild(spanElemDate);

    const pointDiv = document.createElement('div');
    let pointTxt;
    if (pointLog.log === `출석 포인트 적립`) {
      pointTxt = document.createTextNode('+10 P');
    } else {
      pointTxt = document.createTextNode('+50 P');
    }
    pointDiv.appendChild(pointTxt);
    pointDiv.className = 'font-medium text-green-600';

    const midDiv = document.createElement('div');
    midDiv.appendChild(innerDiv);
    midDiv.appendChild(pointDiv);
    midDiv.className = 'flex justify-between';

    details?.appendChild(midDiv);
  }

  // 트로피
  const gold = document.createElement('div');
  const silver = document.createElement('div');
  const bronze = document.createElement('div');
  bronze.innerHTML = `<svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> <g fill="#cd7f32"> <rect x="26" y="48" width="12" height="8" /> <rect x="22" y="56" width="20" height="4" /> <path d="M16 16c0 11 6 20 16 20s16-9 16-20V8H16v8z" /> <path d="M8 8v8c0 5 4 9 9 9V21c-3 0-5-2-5-5V8H8zm48 0v8c0 3-2 5-5 5v4c5 0 9-4 9-9V8h-4z" /> </g> </svg>`;
  silver.innerHTML = `<svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> <g fill="silver"> <rect x="26" y="48" width="12" height="8" /> <rect x="22" y="56" width="20" height="4" /> <path d="M16 16c0 11 6 20 16 20s16-9 16-20V8H16v8z" /> <path d="M8 8v8c0 5 4 9 9 9V21c-3 0-5-2-5-5V8H8zm48 0v8c0 3-2 5-5 5v4c5 0 9-4 9-9V8h-4z" /> </g> </svg>`;
  gold.innerHTML = `<svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> <g fill="gold"> <rect x="26" y="48" width="12" height="8" /> <rect x="22" y="56" width="20" height="4" /> <path d="M16 16c0 11 6 20 16 20s16-9 16-20V8H16v8z" /> <path d="M8 8v8c0 5 4 9 9 9V21c-3 0-5-2-5-5V8H8zm48 0v8c0 3-2 5-5 5v4c5 0 9-4 9-9V8h-4z" /> </g> </svg>`;
  bronze.setAttribute('title', `Wagle 비기너(10P 달성 업적)`);
  bronze.setAttribute('class', `cursor-help`);
  bronze.setAttribute('aria-label', 'Wagle 비기너 트로피 - 10포인트 달성'); // 웹접근성
  silver.setAttribute('title', `Wagle 달인(500P 달성 업적)`);
  silver.setAttribute('class', `cursor-help`);
  silver.setAttribute('aria-label', 'Wagle 달인 트로피 - 500포인트 달성'); // 웹접근성
  gold.setAttribute('title', `Wagle 신(1000P 달성 업적)`);
  gold.setAttribute('class', `cursor-help`);
  gold.setAttribute('aria-label', 'Wagle 신 트로피 - 1000포인트 달성'); // 웹접근성

  const trophySection = document.getElementById('trophy-section');

  // 트로피 로직
  if (points[0] >= 10 && bronze) {
    trophySection?.appendChild(bronze);
  }
  if (points[0] >= 500 && silver) {
    trophySection?.appendChild(silver);
  }
  if (points[0] >= 1000 && gold) {
    trophySection?.appendChild(gold);
  }

  toggleBtn?.addEventListener('click', () => {
    const isExpanded = !section?.classList.contains('max-h-0');

    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');

    // 웹접근성: 확장/축소 상태 알림
    toggleBtn?.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    section?.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
  });

  // 초기 접근성 속성 설정
  toggleBtn?.setAttribute('aria-expanded', 'true');
  section?.setAttribute('aria-hidden', 'false');
});

// 북마크 데이터 타입 정의
type BookmarkData = [string, string, string]; // [url, title, date]

// Toggle article panel - 개선된 버전
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-header');
  const section = document.getElementById('article-panel');
  const icon = document.getElementById('article-toggle-icon');

  // 즐겨찾기 패널 업데이트 함수
  function updateBookmarkPanel() {
    if (!section) return;

    // 패널 내용 초기화
    section.innerHTML = '';

    const bookMark = JSON.parse(localStorage.getItem('bookMark') || '[]') as BookmarkData[];

    // 즐겨찾기가 비어있을 때 메시지 표시
    if (bookMark.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'py-4 px-4 text-center text-gray-500';
      emptyMessage.textContent = '아직 즐겨찾기한 기사가 없습니다.';
      emptyMessage.setAttribute('role', 'status'); // 웹접근성
      emptyMessage.setAttribute('aria-live', 'polite'); // 웹접근성
      section.appendChild(emptyMessage);
      return;
    }

    // 즐겨찾기 항목들 추가
    bookMark.forEach((data: BookmarkData) => {
      // 내부 즐겨찾기 내용
      const linkElem = document.createElement('a');

      const txt = document.createElement('textarea');
      txt.innerHTML = data[1];
      const decoded = txt.value;

      // <b>와 </b> 태그만 제거
      const cleanText = decoded.replace(/<\/?b>/g, '');

      // 텍스트 노드로 변환
      const title = document.createTextNode(cleanText);

      const dateElem = document.createElement('span');
      const date = document.createTextNode(data[2]);

      linkElem.setAttribute('href', data[0]);
      linkElem.setAttribute('target', '_blank');
      linkElem.setAttribute('rel', 'noopener noreferrer');
      linkElem.setAttribute('aria-label', `즐겨찾기 기사: ${cleanText}`); // 웹접근성
      linkElem.appendChild(title);
      linkElem.className = 'text-sm text-gray-900 hover:underline block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'; // 웹접근성 스타일

      dateElem.appendChild(date);
      dateElem.className = 'text-xs text-gray-500';

      // 감싸기 시작
      const innerDiv = document.createElement('div');
      const midDiv = document.createElement('div');
      const outerDiv = document.createElement('div');
      outerDiv.setAttribute('data-link', data[0]);

      midDiv.className = 'flex justify-between items-start';
      outerDiv.className = 'py-2 px-4 border-b border-gray-100';

      innerDiv.appendChild(linkElem);
      innerDiv.appendChild(dateElem);
      midDiv.appendChild(innerDiv);

      const deleteBtn = document.createElement('button');
      deleteBtn.setAttribute('type', 'button');
      deleteBtn.setAttribute('aria-label', '즐겨찾기에서 삭제'); // 웹접근성
      deleteBtn.setAttribute('title', '즐겨찾기에서 삭제'); // 툴팁
      deleteBtn.className = 'cursor-pointer p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'; // 웹접근성 스타일
      deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /> </svg>`;

      deleteBtn.addEventListener('click', event => {
        event.stopPropagation(); // 이벤트 전파 중단
        event.preventDefault(); // 기본 동작 방지 추가

        // 북마크에서 해당 기사 제거
        for (let i = 0; i < bookMark.length; i++) {
          if (bookMark[i][0] === data[0]) {
            bookMark.splice(i, 1); // 배열에서 제거
            localStorage.setItem('bookMark', JSON.stringify(bookMark));

            // 패널 업데이트
            updateBookmarkPanel();

            // 웹접근성: 삭제 완료 알림
            const srAnnouncement = document.createElement('div');
            srAnnouncement.className = 'sr-only';
            srAnnouncement.setAttribute('aria-live', 'polite');
            srAnnouncement.setAttribute('role', 'status');
            srAnnouncement.textContent = '즐겨찾기에서 기사가 삭제되었습니다.';
            document.body.appendChild(srAnnouncement);

            setTimeout(() => {
              if (document.body.contains(srAnnouncement)) {
                document.body.removeChild(srAnnouncement);
              }
            }, 2000);

            break;
          }
        }
      });

      midDiv.appendChild(deleteBtn);
      outerDiv.append(midDiv);

      // 최종 반영
      section.appendChild(outerDiv);
    });

    // 웹접근성: 즐겨찾기 항목 수 알림
    if (bookMark.length > 0) {
      const countAnnouncement = document.createElement('div');
      countAnnouncement.className = 'sr-only';
      countAnnouncement.setAttribute('aria-live', 'polite');
      countAnnouncement.setAttribute('role', 'status');
      countAnnouncement.textContent = `총 ${bookMark.length}개의 즐겨찾기 기사가 있습니다.`;
      section.appendChild(countAnnouncement);
    }
  }

  // 초기 패널 업데이트
  updateBookmarkPanel();

  // 로컬 스토리지 변경 감지 (다른 탭이나 창에서 변경된 경우 대응)
  window.addEventListener('storage', event => {
    if (event.key === 'bookMark') {
      updateBookmarkPanel();
    }
  });

  // 토글 로직
  toggleBtn?.addEventListener('click', () => {
    const isExpanded = !section?.classList.contains('max-h-0');

    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');

    // 웹접근성: 확장/축소 상태 알림
    toggleBtn?.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    section?.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');

    // 토글 버튼 클릭 시에도 패널 내용 업데이트
    updateBookmarkPanel();
  });

  // 초기 접근성 속성 설정
  toggleBtn?.setAttribute('aria-expanded', 'true');
  section?.setAttribute('aria-hidden', 'false');

  // 사이드바 열릴 때마다 즐겨찾기 패널 업데이트
  const openSidebarBtn = document.getElementById('open-sidebar');
  openSidebarBtn?.addEventListener('click', () => {
    updateBookmarkPanel();
  });

  // 마이페이지 탭 클릭 시 업데이트
  const tabMypage = document.getElementById('tab-mypage');
  tabMypage?.addEventListener('click', () => {
    updateBookmarkPanel();
  });
});
// Toggle attendance section
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-attendance');
  const section = document.getElementById('attendance-section');
  const icon = document.getElementById('toggle-icon');

  toggleBtn?.addEventListener('click', () => {
    const isExpanded = !section?.classList.contains('max-h-0');

    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');

    // 웹접근성: 확장/축소 상태 알림
    toggleBtn?.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    section?.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
  });

  // 초기 접근성 속성 설정
  toggleBtn?.setAttribute('aria-expanded', 'true');
  section?.setAttribute('aria-hidden', 'false');

  updateCalendar();
});

export function updateCalendar() {
  // 달력 만들기
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const cals = generateCalendar(year, month);
  const gridElem = document.getElementById('grid-div');
  if (gridElem) gridElem.innerHTML = '';

  // 출석한 날짜들 불러오기!
  const dateLog = JSON.parse(localStorage.getItem('pointLog') || '[]') as {
    date: string;
    log: string;
  }[];

  cals.forEach(cal => {
    let cellElem;
    if (cal == null) {
      cellElem = document.createElement('div');
      cellElem.className = 'h-8';
      cellElem.setAttribute('aria-hidden', 'true'); // 웹접근성: 빈 셀 숨김
    } else {
      cellElem = document.createElement('div');
      cellElem.setAttribute('role', 'gridcell'); // 웹접근성

      if (cal <= day) {
        const isExist = dateLog.some(entry => entry.log?.includes(`출석 포인트 적립`) && entry.date?.includes(`${year}-${String(month).padStart(2, '0')}-${String(cal).padStart(2, '0')}`));

        // 미출석
        if (!isExist) {
          cellElem.className = 'h-8 flex items-center justify-center rounded-full bg-gray-100';
          cellElem.setAttribute('aria-label', `${month}월 ${cal}일 미출석`); // 웹접근성
        } else {
          cellElem.className = 'h-8 flex items-center justify-center rounded-full bg-green-100';
          cellElem.setAttribute('aria-label', `${month}월 ${cal}일 출석완료`); // 웹접근성
        }
      } else {
        cellElem.className = 'h-8 flex items-center justify-center rounded-full';
        cellElem.setAttribute('aria-label', `${month}월 ${cal}일`); // 웹접근성
      }
      cellElem.textContent = `${cal}`;
    }

    gridElem?.appendChild(cellElem);
  });

  const contAttend = document.getElementById('cont-attend');
  const arr = [] as number[];
  dateLog.forEach(data => {
    if (data.log == `출석 포인트 적립`) {
      arr.push(Number(data.date.slice(8, 10)));
    }
  });

  let maxLength = 1;
  arr.reverse();

  for (let i = 0; i < arr.length; i++) {
    if (i + 1 == arr.length) {
      break;
    }
    if (arr[i] == arr[i + 1] + 1) {
      maxLength += 1;
    } else {
      break;
    }
  }

  if (contAttend) {
    contAttend.textContent = `${maxLength}일`;
    contAttend.setAttribute('aria-label', `현재 연속 출석 ${maxLength}일`); // 웹접근성
  }

  function generateCalendar(year: number, month: number): (number | null)[] {
    const calendar = [];

    // 1일이 무슨 요일인지 확인 (0: 일요일, ..., 6: 토요일)
    const firstDay = new Date(year, month - 1, 1).getDay();

    // 해당 월의 마지막 날짜 구하기
    const lastDate = new Date(year, month, 0).getDate();

    // 총 셀 수 = 앞 빈칸 + 날짜 수 → 주 단위(7의 배수)로 만들기
    const totalCells = Math.ceil((firstDay + lastDate) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const date = i - firstDay + 1;
      if (i < firstDay || date > lastDate) {
        calendar.push(null); // 빈칸
      } else {
        calendar.push(date);
      }
    }

    return calendar;
  }
}

// Toggle history panel (히스토리 섹션 토글 기능)
document.addEventListener('DOMContentLoaded', () => {
  const toggleHistoryBtn = document.getElementById('toggle-history');
  const historyPanel = document.getElementById('history-panel');
  const historyIcon = document.getElementById('history-toggle-icon');

  function updateHistoryPanel() {
    if (!historyPanel) return;

    historyPanel.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('history') || '[]') as NaverNewsItem[];
    const reversedHistory = [...history].reverse();

    if (reversedHistory.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'py-4 px-4 text-center text-gray-500';
      emptyMessage.textContent = '아직 열람한 기사가 없습니다.';
      emptyMessage.setAttribute('role', 'status');
      emptyMessage.setAttribute('aria-live', 'polite');
      historyPanel.appendChild(emptyMessage);
    } else {
      reversedHistory.forEach(article => {
        // ✅ 핵심 수정: title이 "[종합]"이면 description에서 제목 추출
        let displayTitle = '';

        if (article.title && article.title !== '[종합]' && article.title.trim() !== '') {
          const decodedTitle = decodeHtmlEntities(article.title);
          displayTitle = decodedTitle.replace(/<\/?[^>]+(>|$)/g, '').trim();
        } else if (article.description) {
          const decodedDesc = decodeHtmlEntities(article.description);
          const cleanDesc = decodedDesc.replace(/<\/?[^>]+(>|$)/g, '').trim();

          const sentences = cleanDesc.split(/[.!?。]/);
          if (sentences.length > 0 && sentences[0].trim()) {
            displayTitle = sentences[0].trim().substring(0, 100);
            if (cleanDesc.length > 100) {
              displayTitle += '...';
            }
          } else {
            displayTitle = cleanDesc.substring(0, 100);
            if (cleanDesc.length > 100) {
              displayTitle += '...';
            }
          }
        }

        if (!displayTitle || displayTitle.trim() === '') {
          displayTitle = '제목 없음';
        }

        const linkElem = document.createElement('a');
        linkElem.setAttribute('href', article.link);
        linkElem.setAttribute('target', '_blank');
        linkElem.setAttribute('rel', 'noopener noreferrer');
        linkElem.setAttribute('aria-label', `열람한 기사: ${displayTitle}`);
        linkElem.textContent = displayTitle;
        linkElem.className = 'text-sm text-gray-900 hover:underline block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1';

        const dateElem = document.createElement('span');
        let displayDate = '';
        if (article.pubDate) {
          try {
            const date = new Date(article.pubDate);
            displayDate = date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
          } catch {
            displayDate = article.pubDate;
          }
        }
        dateElem.textContent = displayDate;
        dateElem.className = 'text-xs text-gray-500 mt-1';

        const innerDiv = document.createElement('div');
        const midDiv = document.createElement('div');
        const outerDiv = document.createElement('div');
        outerDiv.setAttribute('data-link', article.link);

        midDiv.className = 'flex justify-between items-start gap-2';
        outerDiv.className = 'py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors';

        const textContainer = document.createElement('div');
        textContainer.className = 'flex-1 min-w-0';
        textContainer.appendChild(linkElem);
        textContainer.appendChild(dateElem);

        innerDiv.appendChild(textContainer);
        midDiv.appendChild(innerDiv);

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.setAttribute('aria-label', `히스토리에서 "${displayTitle}" 삭제`);
        deleteBtn.setAttribute('title', '히스토리에서 삭제');
        deleteBtn.className = 'flex-shrink-0 p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /> </svg>`;

        deleteBtn.addEventListener('click', event => {
          event.stopPropagation();
          event.preventDefault();

          const updatedHistory = history.filter(item => item.link !== article.link);
          localStorage.setItem('history', JSON.stringify(updatedHistory));
          updateHistoryPanel();

          const srAnnouncement = document.createElement('div');
          srAnnouncement.className = 'sr-only';
          srAnnouncement.setAttribute('aria-live', 'polite');
          srAnnouncement.setAttribute('role', 'status');
          srAnnouncement.textContent = `"${displayTitle}" 기사가 히스토리에서 삭제되었습니다.`;
          document.body.appendChild(srAnnouncement);

          setTimeout(() => {
            if (document.body.contains(srAnnouncement)) {
              document.body.removeChild(srAnnouncement);
            }
          }, 2000);
        });

        midDiv.appendChild(deleteBtn);
        outerDiv.appendChild(midDiv);
        historyPanel.appendChild(outerDiv);
      });
    }
  }

  // 초기 패널 업데이트
  updateHistoryPanel();

  // 로컬 스토리지 변경 감지 (다른 탭이나 창에서 변경된 경우 대응)
  window.addEventListener('storage', event => {
    if (event.key === 'history') {
      updateHistoryPanel();
    }
  });

  // 토글 버튼 이벤트 리스너
  toggleHistoryBtn?.addEventListener('click', () => {
    const isExpanded = !historyPanel?.classList.contains('max-h-0');

    historyPanel?.classList.toggle('max-h-0');
    historyPanel?.classList.toggle('max-h-[1000px]');
    historyIcon?.classList.toggle('rotate-180');

    // 웹접근성: 확장/축소 상태 알림
    toggleHistoryBtn?.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    historyPanel?.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');

    // 토글 버튼 클릭 시에도 패널 내용 업데이트
    updateHistoryPanel();
  });

  // 초기 접근성 속성 설정
  toggleHistoryBtn?.setAttribute('aria-expanded', 'true');
  historyPanel?.setAttribute('aria-hidden', 'false');

  // 사이드바 열릴 때마다 히스토리 패널 업데이트
  const openSidebarBtn = document.getElementById('open-sidebar');
  openSidebarBtn?.addEventListener('click', () => {
    updateHistoryPanel();
  });

  // 히스토리 탭 클릭 시 업데이트
  const tabHistory = document.getElementById('tab-history');
  tabHistory?.addEventListener('click', () => {
    updateHistoryPanel();
  });
});
