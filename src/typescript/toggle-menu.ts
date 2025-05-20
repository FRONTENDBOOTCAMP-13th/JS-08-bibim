document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const openBtn = document.getElementById('open-sidebar');
  const closeBtn = document.getElementById('close-sidebar');

  openBtn?.addEventListener('click', () => {
    sidebar?.classList.remove('translate-x-full');
    sidebar?.classList.add('translate-x-0');
    backdrop?.classList.remove('hidden');
  });

  closeBtn?.addEventListener('click', () => {
    sidebar?.classList.remove('translate-x-0');
    sidebar?.classList.add('translate-x-full');
    backdrop?.classList.add('hidden');
  });

  backdrop?.addEventListener('click', () => {
    sidebar?.classList.remove('translate-x-0');
    sidebar?.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
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

  const pointLogs = JSON.parse(localStorage.getItem('pointLog') || '[]') as { date: string; log: string }[];

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
  const gold = document.getElementById('gold-trophy');
  const silver = document.getElementById('silver-trophy');
  const bronze = document.getElementById('bronze-trophy');

  // 트로피 로직
  if (points[0] >= 10 && bronze) {
    bronze.removeAttribute('hidden');
    bronze.style.display = 'block';
  }
  if (points[0] >= 500 && silver) {
    silver.removeAttribute('hidden');
    silver.style.display = 'block';
  }
  if (points[0] >= 1000 && gold) {
    gold.removeAttribute('hidden');
    gold.style.display = 'block';
  }

  toggleBtn?.addEventListener('click', () => {
    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');
  });
});

// Toggle article panel
// 초기 내용
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-header');
  // 즐찾 기사를 감싸는 div
  const section = document.getElementById('article-panel');
  const icon = document.getElementById('article-toggle-icon');

  const bookMark = JSON.parse(localStorage.getItem('bookMark') || '[]');
  bookMark.forEach((data: string[]) => {
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
    linkElem.appendChild(title);
    linkElem.className = 'text-sm text-gray-900 hover:underline block';

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
    deleteBtn.setAttribute('class', 'cursor-pointer');
    deleteBtn.setAttribute('class', 'delete-btn');
    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /> </svg>`;

    deleteBtn.addEventListener('click', () => {
      // 북마크에서 해당 기사 제거
      for (let i = 0; i < bookMark.length; i++) {
        if (bookMark[i][0] === data[0]) {
          bookMark.splice(i, 1); // 배열에서 제거
          localStorage.setItem('bookMark', JSON.stringify(bookMark));

          const section = document.querySelector('#article-panel');
          const targetDiv = section?.querySelector(`[data-link="${data[0]}"]`);
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
  });

  // 토글 로직
  toggleBtn?.addEventListener('click', () => {
    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');
  });
});

// Toggle attendance section
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-attendance');
  const section = document.getElementById('attendance-section');
  const icon = document.getElementById('toggle-icon');

  toggleBtn?.addEventListener('click', () => {
    section?.classList.toggle('max-h-0');
    section?.classList.toggle('max-h-[1000px]');
    icon?.classList.toggle('rotate-180');
  });

  // 달력 만들기
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const cals = generateCalendar(year, month);
  const gridElem = document.getElementById('grid-div');

  // 출석한 날짜들 불러오기!
  const dateLog = JSON.parse(localStorage.getItem('pointLog') || '[]') as { date: string; log: string }[];

  cals.forEach(cal => {
    let cellElem;
    if (cal == null) {
      cellElem = document.createElement('div');
      cellElem.className = 'h-8';
    } else {
      cellElem = document.createElement('div');
      if (cal <= day) {
        const isExist = dateLog.some(entry => entry.log?.includes(`출석 포인트 적립`) && entry.date?.includes(`${year}-${String(month).padStart(2, '0')}-${String(cal).padStart(2, '0')}`));

        // 미출석
        if (!isExist) {
          cellElem.className = 'h-8 flex items-center justify-center rounded-full bg-gray-100';
        } else {
          cellElem.className = 'h-8 flex items-center justify-center rounded-full bg-green-100';
        }
      } else {
        cellElem.className = 'h-8 flex items-center justify-center rounded-full';
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

  if (contAttend) contAttend.textContent = `${maxLength}일`;
});

function generateCalendar(year: number, month: number): number[] {
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

  return calendar as number[];
}
