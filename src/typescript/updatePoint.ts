export function updatePoint(points: number, log: string) {
  const pointsStorage = JSON.parse(localStorage.getItem('points') || '[0]');
  const logStorage = JSON.parse(localStorage.getItem('pointLog') || '[]') as { date: string; log: string }[];

  const today = new Date().toISOString().slice(0, 10);

  if (log == `출석 포인트 적립`) {
    const isExist = logStorage.some(entry => entry.date.includes(today) && entry.log.includes(log));

    if (!isExist) {
      pointsStorage[0] += points;
      logStorage.push({ date: today, log: log });
    }
  } else if (log.endsWith(`퀴즈 정답`)) {
    const isExist = logStorage.some(entry => entry.log.includes(log));

    if (!isExist) {
      pointsStorage[0] += points;
      logStorage.push({ date: today, log: log });
    }
  }

  localStorage.setItem('points', JSON.stringify(pointsStorage));
  localStorage.setItem('pointLog', JSON.stringify(logStorage));
}
