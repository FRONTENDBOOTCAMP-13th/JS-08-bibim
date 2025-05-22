document.addEventListener('DOMContentLoaded', function () {
  // HTML 요소 타입 정의
  const gameContainer = document.getElementById('game-container') as HTMLElement;
  const player1 = document.getElementById('player1') as HTMLElement;
  const opponent1 = document.getElementById('opponent1') as HTMLElement;
  const ball = document.getElementById('ball') as HTMLElement;
  const scoreDisplay = document.getElementById('score-display') as HTMLElement;
  const gameMessage = document.getElementById('game-message') as HTMLElement;
  const gameStatus = document.getElementById('game-status') as HTMLElement;
  const resultMessage = document.getElementById('result-message') as HTMLElement;
  const resultText = document.getElementById('result-text') as HTMLElement;
  const continueButton = document.getElementById('continue-button') as HTMLButtonElement;
  const startButton = document.getElementById('start-game') as HTMLButtonElement;
  const resetButton = document.getElementById('reset-game') as HTMLButtonElement;
  const highContrastCheckbox = document.getElementById('high-contrast') as HTMLInputElement;
  const slowMotionCheckbox = document.getElementById('slow-motion') as HTMLInputElement;
  const soundEffectsCheckbox = document.getElementById('sound-effects') as HTMLInputElement;

  // 게임 상태 변수 타입 정의
  let gameActive: boolean = false;
  let userScore: number = 0;
  let opponentScore: number = 0;
  let gameSpeed: number = 1;
  const keysPressed: Record<string, boolean> = {};
  let ballDx: number = 0;
  let ballDy: number = 0;
  let lastBallPossession: 'player' | 'opponent' | null = null;

  // 소리 효과 타입 정의
  type SoundEffectType = 'bounce' | 'collision' | 'shoot' | 'user-goal' | 'opponent-goal';

  // 게임 결과 타입 정의
  type GameResult = 'WIN' | 'LOSE';

  // 계속하기 버튼 이벤트 리스너
  continueButton.addEventListener('click', function (): void {
    resultMessage.classList.remove('visible');
    resetPositions();
    gameActive = true; // 계속하기 누르면 게임 다시 시작
    gameLoop();
  });

  // 접근성 설정 적용
  highContrastCheckbox.addEventListener('change', applyAccessibilitySettings);
  slowMotionCheckbox.addEventListener('change', applyAccessibilitySettings);

  function applyAccessibilitySettings(): void {
    const root = document.documentElement;

    // 고대비 모드
    if (highContrastCheckbox.checked) {
      root.style.setProperty('--background-color', '#000000'); // 검정색
      root.style.setProperty('--player-color', '#ffffff'); // 흰색
      root.style.setProperty('--opponent-color', '#DF2020'); // 빨간색
      root.style.setProperty('--ball-color', '#ffff00'); // 노란색
      root.style.setProperty('--primary-color', '#00aaff'); // 밝은 파란색
      gameMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      gameMessage.style.color = '#ffffff';
    } else {
      root.style.setProperty('--background-color', '#238e23'); // 잔디색
      root.style.setProperty('--player-color', '#ffffff'); // 흰색
      root.style.setProperty('--opponent-color', '#A41919'); // 빨간색
      root.style.setProperty('--ball-color', '#ffffff'); // 흰색
      root.style.setProperty('--primary-color', '#3b82f6'); // blue-500
      gameMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
      gameMessage.style.color = '#374151';
    }

    // 게임 속도 조절
    gameSpeed = slowMotionCheckbox.checked ? 0.5 : 1;

    announceStatus('접근성 설정이 적용되었습니다.');
  }

  // 초기 위치 설정
  function resetPositions(): void {
    player1.style.left = '200px';
    player1.style.top = '250px';

    opponent1.style.left = '600px';
    opponent1.style.top = '250px';

    ball.style.left = '400px';
    ball.style.top = '250px';

    ballDx = 0;
    ballDy = 0;
    lastBallPossession = null;
  }

  // 키보드 입력 처리
  document.addEventListener('keydown', function (e: KeyboardEvent): void {
    keysPressed[e.key] = true;

    // 게임 시작
    if (e.key === ' ' && !gameActive) {
      startGame();
    }

    // 슛
    if (e.key === ' ' && gameActive) {
      shoot();
    }
  });

  document.addEventListener('keyup', function (e: KeyboardEvent): void {
    keysPressed[e.key] = false;
  });

  // 게임 시작
  function startGame(): void {
    if (!gameActive) {
      gameActive = true;
      resetPositions();
      updateScore();
      gameMessage.textContent = '게임이 시작되었습니다!';
      announceStatus('게임이 시작되었습니다!');
      resultMessage.classList.remove('visible');
      gameLoop();
    }
  }

  // 게임 재설정
  function resetGame(): void {
    gameActive = false;
    userScore = 0;
    opponentScore = 0;
    resetPositions();
    updateScore();
    gameMessage.textContent = '게임이 재설정되었습니다. 스페이스바를 눌러 시작하세요.';
    announceStatus('게임이 재설정되었습니다. 스페이스바를 눌러 시작하세요.');
    resultMessage.classList.remove('visible');
  }

  // 점수 업데이트
  function updateScore(): void {
    scoreDisplay.textContent = `${userScore} - ${opponentScore}`;
    // 접근성 개선 - ARIA 속성 추가
    scoreDisplay.setAttribute('aria-label', `현재 점수: 나의 팀 ${userScore}, 상대 팀 ${opponentScore}`);
  }

  // 스크린 리더용 상태 알림
  function announceStatus(message: string): void {
    gameStatus.textContent = message;
    // 정책적으로 접근성 개선
    gameStatus.setAttribute('aria-live', 'assertive');
    gameStatus.setAttribute('role', 'status');
  }

  // 플레이어 이동
  function movePlayer(): void {
    const playerSpeed: number = 5 * gameSpeed;
    let currentLeft: number = parseInt(getComputedStyle(player1).left);
    let currentTop: number = parseInt(getComputedStyle(player1).top);

    // 방향키 또는 WASD
    if (keysPressed['ArrowLeft'] || keysPressed['a']) {
      currentLeft -= playerSpeed;
    }
    if (keysPressed['ArrowRight'] || keysPressed['d']) {
      currentLeft += playerSpeed;
    }
    if (keysPressed['ArrowUp'] || keysPressed['w']) {
      currentTop -= playerSpeed;
    }
    if (keysPressed['ArrowDown'] || keysPressed['s']) {
      currentTop += playerSpeed;
    }

    // 화면 경계 내에 유지
    currentLeft = Math.max(30, Math.min(gameContainer.offsetWidth - 30, currentLeft));
    currentTop = Math.max(30, Math.min(gameContainer.offsetHeight - 30, currentTop));

    player1.style.left = currentLeft + 'px';
    player1.style.top = currentTop + 'px';
  }

  // 상대 AI 이동
  function moveOpponents(): void {
    const opponentSpeed: number = 3 * gameSpeed;

    // 상대 선수가 볼을 따라 이동
    const ballLeft: number = parseInt(getComputedStyle(ball).left);
    const ballTop: number = parseInt(getComputedStyle(ball).top);

    const opponentLeft: number = parseInt(getComputedStyle(opponent1).left);
    const opponentTop: number = parseInt(getComputedStyle(opponent1).top);

    // 간단한 AI - 볼 방향으로 이동
    let dx: number = ballLeft - opponentLeft;
    let dy: number = ballTop - opponentTop;
    const distance: number = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      dx = (dx / distance) * opponentSpeed;
      dy = (dy / distance) * opponentSpeed;
    }

    opponent1.style.left = opponentLeft + dx + 'px';
    opponent1.style.top = opponentTop + dy + 'px';
  }

  // 볼 이동
  function moveBall(): void {
    const friction: number = 0.98;

    ballDx *= friction;
    ballDy *= friction;

    // 작은 값은 0으로 처리
    if (Math.abs(ballDx) < 0.1) ballDx = 0;
    if (Math.abs(ballDy) < 0.1) ballDy = 0;

    let ballLeft: number = parseInt(getComputedStyle(ball).left);
    let ballTop: number = parseInt(getComputedStyle(ball).top);

    // 이전 위치 저장
    // const prevLeft: number = ballLeft;
    // const prevTop: number = ballTop;

    // 볼 위치 업데이트
    ballLeft += ballDx * gameSpeed;
    ballTop += ballDy * gameSpeed;

    // 경기장 경계 계산
    const fieldMinX: number = 10;
    const fieldMaxX: number = gameContainer.offsetWidth - 10;
    const fieldMinY: number = 10;
    const fieldMaxY: number = gameContainer.offsetHeight - 10;

    // 골대 범위 계산
    const isInGoalYRange: boolean = ballTop > 150 && ballTop < 350;

    // 볼이 좌우 경계에 닿았을 때 처리
    if (ballLeft < fieldMinX || ballLeft > fieldMaxX) {
      // 골대 범위 내에서 골 체크
      if (isInGoalYRange) {
        if (ballLeft < fieldMinX) {
          // 왼쪽 골 (상대팀 득점)
          opponentScore++;
          updateScore();
          gameMessage.textContent = '상대팀이 골을 넣었습니다!';
          announceStatus('상대팀이 골을 넣었습니다!');
          playSoundEffect('opponent-goal');

          // 결과 표시 - LOSE
          showResult('LOSE');
          resetPositions();
          return;
        } else if (ballLeft > fieldMaxX) {
          // 오른쪽 골 (내 팀 득점)
          userScore++;
          updateScore();
          gameMessage.textContent = '골인! 득점했습니다!';
          announceStatus('골인! 득점했습니다!');
          playSoundEffect('user-goal');

          // 결과 표시 - WIN
          showResult('WIN');
          resetPositions();
          return;
        }
      } else {
        // 골대 범위 밖에서는 튕김 처리
        // 경계 내부로 볼 위치 조정 및 방향 반전
        if (ballLeft < fieldMinX) {
          ballLeft = fieldMinX;
          ballDx = Math.abs(ballDx); // 오른쪽으로 방향 변경
        } else {
          ballLeft = fieldMaxX;
          ballDx = -Math.abs(ballDx); // 왼쪽으로 방향 변경
        }
        playSoundEffect('bounce');
      }
    }

    // 볼이 상하 경계에 닿았을 때 처리
    if (ballTop < fieldMinY || ballTop > fieldMaxY) {
      // 경계 내부로 볼 위치 조정 및 방향 반전
      if (ballTop < fieldMinY) {
        ballTop = fieldMinY;
        ballDy = Math.abs(ballDy); // 아래로 방향 변경
      } else {
        ballTop = fieldMaxY;
        ballDy = -Math.abs(ballDy); // 위로 방향 변경
      }
      playSoundEffect('bounce');
    }

    // 수정된 위치 적용
    ball.style.left = ballLeft + 'px';
    ball.style.top = ballTop + 'px';

    // 충돌 감지
    checkCollisions();
  }

  // 슛 기능
  function shoot(): void {
    const playerLeft: number = parseInt(getComputedStyle(player1).left);
    const playerTop: number = parseInt(getComputedStyle(player1).top);
    const ballLeft: number = parseInt(getComputedStyle(ball).left);
    const ballTop: number = parseInt(getComputedStyle(ball).top);

    // 플레이어가 볼과 가까이 있을 때만 슛 가능
    const dx: number = ballLeft - playerLeft;
    const dy: number = ballTop - playerTop;
    const distance: number = Math.sqrt(dx * dx + dy * dy);

    if (distance < 50) {
      // 슛의 방향은 오른쪽 골대 쪽으로
      ballDx = 10 * gameSpeed;
      ballDy = (Math.random() - 0.5) * 5 * gameSpeed;

      lastBallPossession = 'player';
      gameMessage.textContent = '슛!';
      announceStatus('슛!');
      playSoundEffect('shoot');
    }
  }

  // 충돌 감지
  function checkCollisions(): void {
    const ballLeft: number = parseInt(getComputedStyle(ball).left);
    const ballTop: number = parseInt(getComputedStyle(ball).top);

    // 플레이어와 볼 충돌
    function checkPlayerCollision(player: HTMLElement, isOpponent: boolean = false): void {
      const playerLeft: number = parseInt(getComputedStyle(player).left);
      const playerTop: number = parseInt(getComputedStyle(player).top);

      const dx: number = ballLeft - playerLeft;
      const dy: number = ballTop - playerTop;
      const distance: number = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30) {
        // 선수 반지름 + 볼 반지름
        // 충돌 방향에 따라 볼 방향 변경
        ballDx = dx * 0.5;
        ballDy = dy * 0.5;

        // 충돌 소리 재생
        playSoundEffect('collision');

        // 볼 소유권 업데이트
        if (isOpponent) {
          if (lastBallPossession !== 'opponent') {
            lastBallPossession = 'opponent';
            gameMessage.textContent = '상대팀이 볼을 소유했습니다';
            announceStatus('상대팀이 볼을 소유했습니다');
          }
        } else {
          if (lastBallPossession !== 'player') {
            lastBallPossession = 'player';
            gameMessage.textContent = '우리팀이 볼을 소유했습니다';
            announceStatus('우리팀이 볼을 소유했습니다');
          }
        }
      }
    }

    checkPlayerCollision(player1);
    checkPlayerCollision(opponent1, true);
  }

  // 소리 효과 재생
  function playSoundEffect(type: SoundEffectType): void {
    if (!soundEffectsCheckbox.checked) return;

    // 실제 구현에서는 여기에 소리 재생 코드를 추가
    console.log(`소리 효과 재생: ${type}`);

    // 아래는 소리 API를 이용한 구현 예시 (실제 소리 파일 필요)
    /*
    const sounds: Record<SoundEffectType, string> = {
        'bounce': 'bounce.mp3',
        'collision': 'collision.mp3',
        'shoot': 'shoot.mp3',
        'user-goal': 'user-goal.mp3',
        'opponent-goal': 'opponent-goal.mp3'
    };
    
    if (type in sounds) {
        const audio = new Audio(sounds[type]);
        audio.play().catch(err => {
          console.error('소리 재생 중 오류가 발생했습니다:', err);
        });
    }
    */
  }

  // 게임 루프
  function gameLoop(): void {
    if (!gameActive) return;

    movePlayer();
    moveOpponents();
    moveBall();

    requestAnimationFrame(gameLoop);
  }

  // 결과 표시 함수
  function showResult(result: GameResult): void {
    // 게임 중지
    gameActive = false;

    if (result === 'WIN') {
      resultText.textContent = '승리했습니다!';
      announceStatus('승리했습니다!');
    } else {
      resultText.textContent = '패배했습니다!';
      announceStatus('패배했습니다!');
    }

    // 결과 메시지 표시
    resultMessage.classList.add('visible');

    // 계속하기 버튼에 접근성 포커스 이동
    setTimeout(() => {
      continueButton.focus();
    }, 500);
  }

  // 웹 접근성 개선 - ARIA 속성 추가
  function setupAccessibility(): void {
    // 게임 컨테이너에 역할 부여
    gameContainer.setAttribute('role', 'application');
    gameContainer.setAttribute('aria-label', '축구 게임');

    // 플레이어 요소 접근성
    player1.setAttribute('role', 'img');
    player1.setAttribute('aria-label', '나의 선수');

    // 상대 선수 접근성
    opponent1.setAttribute('role', 'img');
    opponent1.setAttribute('aria-label', '상대 선수');

    // 볼 접근성
    ball.setAttribute('role', 'img');
    ball.setAttribute('aria-label', '축구공');

    // 상태 메시지 접근성
    gameMessage.setAttribute('role', 'status');
    gameMessage.setAttribute('aria-live', 'polite');

    // 게임 상태 알림 접근성
    gameStatus.setAttribute('role', 'status');
    gameStatus.setAttribute('aria-live', 'assertive');

    // 결과 메시지 접근성
    resultMessage.setAttribute('role', 'alertdialog');
    resultMessage.setAttribute('aria-modal', 'true');

    // 버튼에 접근성 레이블 추가
    startButton.setAttribute('aria-label', '게임 시작하기');
    resetButton.setAttribute('aria-label', '게임 재설정하기');
    continueButton.setAttribute('aria-label', '게임 계속하기');

    // 체크박스 레이블 접근성 (레이블과 연결되어 있다고 가정)
    highContrastCheckbox.setAttribute('aria-label', '고대비 모드');
    slowMotionCheckbox.setAttribute('aria-label', '느린 동작 모드');
    soundEffectsCheckbox.setAttribute('aria-label', '소리 효과');
  }

  // 버튼 이벤트
  startButton.addEventListener('click', startGame);
  resetButton.addEventListener('click', resetGame);

  // 접근성 설정 초기화
  setupAccessibility();

  // 초기화
  resetPositions();
  updateScore();
});
