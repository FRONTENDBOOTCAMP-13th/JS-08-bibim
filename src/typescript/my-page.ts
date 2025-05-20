document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="menu"]');
  const labels = document.querySelectorAll<HTMLLabelElement>('label[for]');
  const sections = document.querySelectorAll<HTMLDivElement>('div[name="sections"]');

  function updateLabel() {
    labels.forEach(label => label.classList.remove('bg-[#fc5f6f]', 'text-white'));
    sections.forEach(section => (section.style.display = 'none'));

    const checkedRadio = document.querySelector<HTMLInputElement>('input[name="menu"]:checked');
    const checkedLabel = checkedRadio ? document.querySelector<HTMLLabelElement>(`label[for="${checkedRadio.id}"]`) : null;

    if (checkedLabel) checkedLabel.classList.add('bg-[#fc5f6f]', 'text-white');

    if (checkedRadio) {
      const index = Array.from(radios).indexOf(checkedRadio);
      if (sections[index]) sections[index].style.display = 'flex';
    }
  }

  radios.forEach(radio => {
    radio.addEventListener('change', updateLabel);
  });

  updateLabel();

  const calendar = document.getElementById('calendar-grid');
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0부터 시작 (0 = 1월)
  const date = today.getDate();
  const calendarTitle = document.getElementById('calendar-title');

  if (calendarTitle) {
    calendarTitle.textContent = `📅 ${year}년 ${month + 1}월`;
  }
  const firstDay = new Date(year, month, 1).getDay(); // 해당 달의 1일의 요일
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 해당 달의 마지막 날짜

  const totalCells = 42; // 7일 x 6주
  let dayCounter = 1;

  // 방문 날짜 배열 (웹 스토리지에서 가져오기)
  const visitedDays = JSON.parse(localStorage.getItem('visitedDays') || '[]') as number[];

  // 오늘 방문한 날짜 저장 (중복 저장 방지)
  if (!visitedDays.includes(date)) {
    visitedDays.push(date);
    localStorage.setItem('visitedDays', JSON.stringify(visitedDays));
  }

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'flex items-center justify-center h-16 w-16';

    if (i >= firstDay && dayCounter <= daysInMonth) {
      if (dayCounter === date) {
        cell.innerHTML = `<div class="w-8 h-8 rounded-full border-4 border-red-500 flex items-center justify-center">${dayCounter}</div>`;
      } else {
        cell.textContent = String(dayCounter);
      }

      if (visitedDays.includes(dayCounter)) {
        cell.classList.add('bg-orange-400', 'text-white');
      }

      dayCounter++;
    }

    calendar?.appendChild(cell);
  }

  const pointElem = document.getElementById('point-section');
  const points = JSON.parse(localStorage.getItem('points') || '[0]') as number[];
  const pointLog = JSON.parse(localStorage.getItem('pointLog') || '[]') as string[];
  if (!pointLog.includes(`${date}일 출석 포인트 지급`)) {
    pointLog.push(`${date}일 출석 포인트 지급`);
    points[0] = points[0] + 10;
    localStorage.setItem('points', JSON.stringify(points));
    localStorage.setItem('pointLog', JSON.stringify(pointLog));
  }

  if (pointElem) pointElem.textContent = String(points[0]);

  // 열람한 기사에는 뉴스 카드 가져와서 붙이기
});
