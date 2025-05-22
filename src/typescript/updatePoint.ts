export function updatePoint(points: number, log: string) {
  const pointsStorage = JSON.parse(localStorage.getItem('points') || '[0]');
  const logStorage = JSON.parse(localStorage.getItem('pointLog') || '[]') as {
    date: string;
    log: string;
  }[];

  const today = new Date().toISOString().slice(0, 10);

  if (log == `출석 포인트 적립`) {
    const isExist = logStorage.some(entry => entry.date.includes(today) && entry.log.includes(log));

    if (!isExist) {
      pointsStorage[0] += points;
      logStorage.push({ date: today, log: log });
      localStorage.setItem('points', JSON.stringify(pointsStorage));
      localStorage.setItem('pointLog', JSON.stringify(logStorage));
      renderPoint();
    }
  } else if (log.endsWith(`퀴즈 정답`)) {
    const isExist = logStorage.some(entry => entry.log.includes(log));

    if (!isExist) {
      pointsStorage[0] += points;
      logStorage.push({ date: today, log: log });
      localStorage.setItem('points', JSON.stringify(pointsStorage));
      localStorage.setItem('pointLog', JSON.stringify(logStorage));
    }
  }
}

export function renderPoint() {
  const pointsStorage = JSON.parse(localStorage.getItem('points') || '[0]');
  const logStorage = JSON.parse(localStorage.getItem('pointLog') || '[]') as {
    date: string;
    log: string;
  }[];

  const reversedLogs = logStorage.slice().reverse();

  const pointView = document.getElementById('point-view');
  const details = document.querySelector('.point-details');

  if (pointView) pointView.textContent = `${pointsStorage[0]} P`;
  console.log(details);

  if (details) {
    const pointLog = reversedLogs[0];
    const spanElemLog = document.createElement('span');
    let logTxt;

    if (pointLog.log && pointLog.log === `출석 포인트 적립`) {
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

    details.insertBefore(midDiv, details.firstChild);
  }
}
