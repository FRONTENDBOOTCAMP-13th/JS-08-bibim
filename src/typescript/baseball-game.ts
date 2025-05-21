// HTML 요소 타입 설정
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const swingBtn = document.getElementById('swingBtn') as HTMLButtonElement;
const message = document.getElementById('message') as HTMLElement;
const barFill = document.getElementById('barFill') as HTMLElement;
const resultEffect = document.getElementById('resultEffect') as HTMLElement;
const timingPrompt = document.getElementById('timingPrompt') as HTMLElement;

// 상태 관리를 위한 변수들
let throwTime: number = 0;
let canSwing: boolean = false;
let barInterval: number | null = null;
let barStartTime: number = 0;

// 결과 타입 정의
type ResultType = 'miss' | 'homerun' | 'hit';

// 접근성 개선 - ARIA 속성 추가
startBtn.setAttribute('aria-label', '게임 시작하기');
swingBtn.setAttribute('aria-label', '스윙하기');
message.setAttribute('role', 'status');
message.setAttribute('aria-live', 'assertive');
resultEffect.setAttribute('aria-live', 'assertive');

startBtn.addEventListener('click', (): void => {
  message.textContent = '투수가 준비 중...';
  timingPrompt.textContent = '';
  resultEffect.textContent = '';
  resultEffect.className = '';
  swingBtn.disabled = true;
  canSwing = false;
  barFill.style.width = '0%';

  if (barInterval !== null) {
    clearInterval(barInterval);
    barInterval = null;
  }

  const delay: number = Math.floor(Math.random() * 2000) + 1000;

  setTimeout((): void => {
    message.textContent = '⚾ 공이 날아옵니다!';
    throwTime = Date.now();
    canSwing = true;
    swingBtn.disabled = false;
    swingBtn.focus(); // 접근성 개선 - 스윙 버튼으로 포커스 이동

    barStartTime = Date.now();
    barInterval = window.setInterval((): void => {
      const elapsed: number = Date.now() - barStartTime;
      const percent: number = Math.min((elapsed / 1000) * 100, 100);
      barFill.style.width = `${percent}%`;
      barFill.setAttribute('aria-valuenow', percent.toString()); // 접근성 개선 - 현재 값 설정

      if (elapsed >= 150 && elapsed <= 300) {
        timingPrompt.textContent = '🔥 지금 스윙하세요!';
      } else {
        timingPrompt.textContent = '';
      }

      if (percent >= 100) {
        if (barInterval !== null) {
          clearInterval(barInterval);
          barInterval = null;
        }

        if (canSwing) {
          message.textContent = '⚾ 스트라이크! 스윙하지 않았습니다.';
          showResultEffect('스트라이크!', 'miss');
          canSwing = false;
          swingBtn.disabled = true;
        }
      }
    }, 10);
  }, delay);
});

swingBtn.addEventListener('click', (): void => {
  if (!canSwing) {
    message.textContent = '❌ 아직 공이 나오지 않았어요! (헛스윙)';
    showResultEffect('헛스윙!', 'miss');
    return;
  }

  const swingTime: number = Date.now();
  const reactionTime: number = swingTime - throwTime;

  if (barInterval !== null) {
    clearInterval(barInterval);
    barInterval = null;
  }

  timingPrompt.textContent = '';
  canSwing = false;
  swingBtn.disabled = true;

  if (reactionTime < 150) {
    message.textContent = `😬 너무 빨랐어요! (${reactionTime}ms) → 헛스윙`;
    showResultEffect('헛스윙!', 'miss');
  } else if (reactionTime <= 300) {
    message.textContent = `💥 굿 타이밍! (${reactionTime}ms) → 홈런!`;
    showResultEffect('홈런!', 'homerun');
  } else if (reactionTime <= 500) {
    message.textContent = `✅ 타격 성공! (${reactionTime}ms) → 안타!`;
    showResultEffect('안타!', 'hit');
  } else {
    message.textContent = `😵 너무 늦었어요! (${reactionTime}ms) → 헛스윙`;
    showResultEffect('헛스윙!', 'miss');
  }
});

function showResultEffect(text: string, effectClass: ResultType): void {
  resultEffect.textContent = text;
  resultEffect.className = effectClass;
}

// 추가: 키보드 접근성 개선
document.addEventListener('keydown', (event: KeyboardEvent): void => {
  if (event.code === 'Space' && !swingBtn.disabled) {
    event.preventDefault(); // 스페이스바의 스크롤 동작 방지
    swingBtn.click();
  }
});

// 추가: 타이머 바의 접근성 개선을 위한 ARIA 설정
const timerBar = document.getElementById('timerBar') as HTMLElement;
if (timerBar) {
  timerBar.setAttribute('role', 'progressbar');
  timerBar.setAttribute('aria-valuemin', '0');
  timerBar.setAttribute('aria-valuemax', '100');
  timerBar.setAttribute('aria-valuenow', '0');
}
