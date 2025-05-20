interface Option {
  value: string;
  text: string;
}
interface Question {
  id: number;
  text: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: 1,
    text: '아침에 일어나서 가장 먼저 확인하는 것은?',
    options: [
      { value: 'A', text: '어제 있었던 야구 경기 결과' },
      { value: 'B', text: '좋아하는 축구팀의 최근 소식' },
      { value: 'C', text: '연예인들의 최신 소식과 게시물' },
      { value: 'D', text: '주요 사회 이슈와 문화 소식' },
      { value: 'E', text: '최신 IT 기기 출시나 기술 동향' },
      { value: 'F', text: '주식 시장과 경제 지표' },
      { value: 'G', text: '국내외 정치 상황과 이슈' },
    ],
  },
  {
    id: 2,
    text: '주말에 시간이 생겼을 때 가장 하고 싶은 활동은?',
    options: [
      { value: 'A', text: '야구장에 가서 직접 경기 관람하기' },
      { value: 'B', text: 'TV나 스트리밍으로 축구 경기 시청하기' },
      { value: 'C', text: '최신 영화나 TV 프로그램 감상하기' },
      { value: 'D', text: '전시회나 문화 행사 참여하기' },
      { value: 'E', text: '새로운 기술 제품 체험하거나 관련 정보 찾아보기' },
      { value: 'F', text: '재테크나 투자 관련 정보 검색하기' },
      { value: 'G', text: '시사 프로그램이나 정치 토론 시청하기' },
    ],
  },
  {
    id: 3,
    text: '대화 중에 가장 열정적으로 참여하게 되는 주제는?',
    options: [
      { value: 'A', text: 'KBO 선수들의 성적이나 팀 순위' },
      { value: 'B', text: '국내외 축구 리그나 선수 이야기' },
      { value: 'C', text: '인기 연예인이나 최신 드라마, 예능 프로그램' },
      { value: 'D', text: '최근 사회적 이슈나 문화 트렌드' },
      { value: 'E', text: '신기술이나 IT 기기, 과학적 발견' },
      { value: 'F', text: '부동산, 주식, 경제 정책' },
      { value: 'G', text: '정치인의 발언이나 정책, 정치적 쟁점' },
    ],
  },
  {
    id: 4,
    text: '스마트폰에서 가장 자주 사용하는 앱 유형은?',
    options: [
      { value: 'A', text: '야구 경기 중계나 KBO 관련 앱' },
      { value: 'B', text: '축구 정보나 중계 관련 앱' },
      { value: 'C', text: '연예 뉴스나 엔터테인먼트 콘텐츠 앱' },
      { value: 'D', text: '사회 이슈나 문화 콘텐츠 관련 앱' },
      { value: 'E', text: 'IT 뉴스나 기술 관련 앱' },
      { value: 'F', text: '주식, 금융, 경제 정보 앱' },
      { value: 'G', text: '정치 뉴스나 시사 정보 앱' },
    ],
  },
  {
    id: 5,
    text: '유튜브에서 주로 보는 콘텐츠는?',
    options: [
      { value: 'A', text: '야구 경기 하이라이트나 분석 영상' },
      { value: 'B', text: '축구 경기 하이라이트나 분석 영상' },
      { value: 'C', text: '연예인 인터뷰나 예능 콘텐츠' },
      { value: 'D', text: '사회 현상이나 문화 트렌드 관련 영상' },
      { value: 'E', text: '신기술 리뷰나 과학 관련 영상' },
      { value: 'F', text: '재테크 팁이나 경제 분석 영상' },
      { value: 'G', text: '정치 토론이나 시사 분석 영상' },
    ],
  },
  {
    id: 6,
    text: '친구와의 대화에서 주로 언급하는 주제는?',
    options: [
      { value: 'A', text: '어제 야구 경기의 명장면이나 선수 이야기' },
      { value: 'B', text: '최근 축구 경기 결과나 선수 이적 소식' },
      { value: 'C', text: '인기 연예인의 근황이나 신작 영화, 드라마' },
      { value: 'D', text: '최근 사회적 이슈나 문화 현상' },
      { value: 'E', text: '새롭게 출시된 기기나 흥미로운 과학 소식' },
      { value: 'F', text: '투자 팁이나 경제 상황에 대한 전망' },
      { value: 'G', text: '정치적 사건이나 정책에 대한 의견' },
    ],
  },
  {
    id: 7,
    text: 'SNS에서 주로 팔로우하는 계정은?',
    options: [
      { value: 'A', text: 'KBO 구단이나 야구 선수들' },
      { value: 'B', text: '축구 클럽이나 선수들' },
      { value: 'C', text: '연예인이나 엔터테인먼트 관련 계정' },
      { value: 'D', text: '사회 이슈나 문화 트렌드 관련 계정' },
      { value: 'E', text: 'IT 기업이나 과학자, 기술 관련 계정' },
      { value: 'F', text: '경제 분석가나 금융 관련 계정' },
      { value: 'G', text: '정치인이나 정치 관련 미디어' },
    ],
  },
  {
    id: 8,
    text: '뉴스 앱에서 가장 먼저 확인하는 섹션은?',
    options: [
      { value: 'A', text: 'KBO 야구 소식' },
      { value: 'B', text: '축구 관련 뉴스' },
      { value: 'C', text: '연예 소식' },
      { value: 'D', text: '사회/문화 뉴스' },
      { value: 'E', text: 'IT/과학 소식' },
      { value: 'F', text: '경제 뉴스' },
      { value: 'G', text: '정치 뉴스' },
    ],
  },
  {
    id: 9,
    text: '다음 중 가장 많이 알고 있는 인물은?',
    options: [
      { value: 'A', text: 'KBO 리그의 주요 선수들' },
      { value: 'B', text: 'K리그나 해외 축구 리그의 선수들' },
      { value: 'C', text: '인기 연예인이나 배우들' },
      { value: 'D', text: '사회적 인플루언서나 문화계 인사들' },
      { value: 'E', text: 'IT 기업 CEO나 과학자들' },
      { value: 'F', text: '경제 전문가나 기업 경영자들' },
      { value: 'G', text: '정치인이나 정치 평론가들' },
    ],
  },
  {
    id: 10,
    text: '평소 가장 궁금해하고 찾아보는 정보는?',
    options: [
      { value: 'A', text: '야구팀 순위나 선수 기록' },
      { value: 'B', text: '축구 경기 일정이나 결과' },
      { value: 'C', text: '연예인 소식이나 방송 프로그램 정보' },
      { value: 'D', text: '사회적 이슈나 문화 행사' },
      { value: 'E', text: '신기술 소식이나 과학적 발견' },
      { value: 'F', text: '주식 시세나 경제 지표' },
      { value: 'G', text: '정치적 현안이나 정책 동향' },
    ],
  },
  {
    id: 11,
    text: '다른 사람과 공유하고 싶은 뉴스는?',
    options: [
      { value: 'A', text: '흥미로운 야구 경기 결과나 이적 소식' },
      { value: 'B', text: '인상적인 축구 경기나 골 장면' },
      { value: 'C', text: '연예계 소식이나 새로운 영화, 음악' },
      { value: 'D', text: '중요한 사회 이슈나 문화 현상' },
      { value: 'E', text: '혁신적인 기술이나 과학적 발견' },
      { value: 'F', text: '투자에 도움이 될 경제 정보' },
      { value: 'G', text: '중요한 정치적 사건이나 정책 변화' },
    ],
  },
  {
    id: 12,
    text: '시간이 날 때 주로 보는 TV 프로그램은?',
    options: [
      { value: 'A', text: '야구 중계나 스포츠 분석 프로그램' },
      { value: 'B', text: '축구 중계나 관련 토크쇼' },
      { value: 'C', text: '예능 프로그램이나 드라마' },
      { value: 'D', text: '다큐멘터리나 시사 교양 프로그램' },
      { value: 'E', text: '과학 다큐멘터리나 기술 프로그램' },
      { value: 'F', text: '경제 전문 채널이나 재테크 프로그램' },
      { value: 'G', text: '정치 토론회나 뉴스 심층 분석 프로그램' },
    ],
  },
  {
    id: 13,
    text: '뉴스를 통해 주로 얻고 싶은 정보는?',
    options: [
      { value: 'A', text: '야구팀과 선수들에 대한 최신 소식' },
      { value: 'B', text: '축구 경기 결과와 팀 소식' },
      { value: 'C', text: '연예인들의 활동과 신작 소식' },
      { value: 'D', text: '사회 현상과 문화적 트렌드' },
      { value: 'E', text: '기술 발전과 과학적 혁신' },
      { value: 'F', text: '경제 동향과 투자 기회' },
      { value: 'G', text: '정치적 상황과 정책 변화' },
    ],
  },
  {
    id: 14,
    text: '오랫동안 이야기할 수 있는 주제는?',
    options: [
      { value: 'A', text: 'KBO 야구의 전략과 선수들의 기량' },
      { value: 'B', text: '축구 전술과 경기 분석' },
      { value: 'C', text: '좋아하는 연예인이나 작품에 대한 이야기' },
      { value: 'D', text: '사회 현상이나 문화적 의미' },
      { value: 'E', text: '기술 발전 방향과 과학적 영향' },
      { value: 'F', text: '경제 상황과 미래 전망' },
      { value: 'G', text: '정치적 이념과 정책 평가' },
    ],
  },
];

//카테고리 결과 정의
const categoryResult = {
  A: { name: '야구', message: '당신은 야구 소식을 가장 즐겨보는 사람입니다.' },
  B: { name: '축구', message: '당신은 축구 소식을 가장 즐겨보는 사람입니다.' },
  C: { name: '연예', message: '당신은 연예 소식을 가장 즐겨보는 사람입니다.' },
  D: { name: '사회/문화', message: '당신은 사회/문화화 소식을 가장 즐겨보는 사람입니다.' },
  E: { name: 'IT/과학', message: '당신은 IT/과학 소식을 가장 즐겨보는 사람입니다.' },
  F: { name: '경제', message: '당신은 경제 소식을 가장 즐겨보는 사람입니다.' },
  G: { name: '정치', message: '당신은 정치 소식을 가장 즐겨보는 사람입니다.' },
};

const questionContainer = document.querySelector('#questionContainer');
const nextButton = document.querySelector('#nextButton');
const prevButton = document.querySelector('#prevButton');
const progressBar = document.querySelector('#progressBar');
const resultContainer = document.querySelector('#resultContainer');
let userAnswers: string[] = []; //사용자 응답 저장할 배열
let quizStarted = false; //퀴즈가 시작했는지 안했는지 여부
let currentQuestionIndex = 0; // 현재 몇번째 질문인지

// 첫화면을 나타낼 함수
function init(): void {
  nextButton?.addEventListener('click', handleNextButton);
  prevButton?.addEventListener('click', handleprevButton);

  // 초기 상태 설정
  updateButtonStates();
  updateProgress(0);
}

// 시작화면을 표시, 나중에 게임 다시하기 했을때 사용할거
function showStartScreen(): void {
  if (questionContainer) {
    questionContainer.innerHTML = '';
    const startContainer = document.createElement('p');
    startContainer.className = 'text-2xl text-center';
    startContainer.innerHTML = `나에게 맞는 뉴스 카테고리를 찾는 테스트입니다.<br />
    시작하시려면 아래의 <strong class="text-blue-500">"시작하기"</strong> 버튼을 눌러주세요`;
    questionContainer.appendChild(startContainer);

    prevButton?.classList.add('hidden');
    nextButton?.classList.remove('hidden');
    if (nextButton) nextButton.textContent = '시작하기';
    nextButton?.setAttribute('aria-label', '시작하기');
  }
}

//질문화면을 보여주는 함수
function showQuestion(index: number): void {
  const question = questions[index];
  if (questionContainer) {
    questionContainer.innerHTML = '';

    //질문부분 추가
    const title = document.createElement('p');
    title.className = 'text-3xl font-bold';
    title.textContent = `${question.id}. ${question.text}`;
    questionContainer.appendChild(title);

    //옵션부분 추가
    const optionList = document.createElement('ul');
    optionList.className = 'w-full space-y-3 mt-4';

    question.options.forEach(option => {
      const listItem = document.createElement('li');
      listItem.className = 'p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition';
      listItem.textContent = option.text;

      // 이미 선택한 옵션인 경우 스타일 적용
      if (userAnswers[index] === option.value) {
        listItem.classList.add('bg-blue-100', 'border-blue-500');
      }

      //리스트를 클릭했을때 일어날 이벤트
      listItem.addEventListener('click', () => {
        userAnswers[index] = option.value; //사용자의 답변을 배열에 저장하고
        //클릭한것의 스타일 변경
        optionList.querySelectorAll('li').forEach(item => {
          item.classList.remove('bg-blue-100', 'border-blue-500');
        });
        listItem.classList.add('bg-blue-100', 'border-blue-500');
      });

      optionList.appendChild(listItem);
    });
    questionContainer.append(optionList);

    // 진행 상황 업데이트
    updateProgress(index);
  }
  updateButtonStates();
}

// 진행 상황 업데이트 함수
function updateProgress(index: number): void {
  if (!quizStarted) {
    //퀴즈가 시작되지 않았을때
    progressBar?.setAttribute('style', 'width: 0%');
  } else {
    const percentage = ((index + 1) * 100) / questions.length;
    if (progressBar) {
      progressBar.setAttribute('style', `width: ${percentage}%`);
    }
  }
}

//버튼 상태 업데이트 함수
function updateButtonStates(): void {
  if (!quizStarted) {
    prevButton?.classList.add('hidden');
    if (nextButton) nextButton.textContent = '시작하기';
  } else {
    //퀴즈가 진행중일때
    prevButton?.classList.remove('hidden');

    // 마지막 질문인지 확인
    if (currentQuestionIndex === questions.length - 1) {
      if (nextButton) nextButton.textContent = '결과 보기';
    } else {
      if (nextButton) nextButton.textContent = '다음';
    }
  }
}

//다음 버튼을 눌렀을때 일어나게할 함수
function handleNextButton() {
  //처음에 next버튼을 눌렀을때
  if (!quizStarted) {
    quizStarted = true;
    currentQuestionIndex = 0;
    showQuestion(currentQuestionIndex);
    updateButtonStates();
    return;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    //질문의 갯수 확인
    showQuestion(currentQuestionIndex);
    updateButtonStates();
  } else {
    showResult();
  }
}

//이전 버튼을 눌렀을때 일어나게할 함수
function handleprevButton() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  } else {
    //첫번째 문제인 경우
    quizStarted = false;
    showStartScreen();

    //진행바를 0%로 만들기
    progressBar?.setAttribute('style', 'width:0%');
  }
  updateButtonStates();
}

//결과표시 함수
function showResult(): void {
  //카테고리별 응답 수 계산
  const categoryCounts: { [key: string]: number } = {};
  userAnswers.forEach(answer => {
    if (answer) {
      categoryCounts[answer] = (categoryCounts[answer] || 0) + 1;
    }
  });

  console.log('Category counts:', categoryCounts);
  // 가장 많이 선택된 카테고리 찾기
  let topCategory = '';
  let maxCount = 0;

  for (const category in categoryCounts) {
    if (categoryCounts[category] > maxCount) {
      maxCount = categoryCounts[category];
      topCategory = category;
    }
  }

  // 결과 메시지 가져오기
  const result = categoryResult[topCategory as keyof typeof categoryResult] || {
    name: '종합',
    message: '당신은 다양한 분야의 뉴스를 골고루 즐겨봅니다.',
  };

  // 결과 UI 표시
  if (questionContainer && resultContainer) {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
      <h2 class="text-3xl font-bold mb-6">테스트 결과</h2>
      <p class="text-5xl font-bold text-blue-600 mb-6">${result.name}</p>
      <p class="text-xl mb-8">${result.message}</p>
      <button id="restartButton" class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg">
        다시 시작하기
      </button>
    `;

    // 다시 시작 버튼에 이벤트 추가
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
      restartButton.addEventListener('click', restartQuiz);
    }
    // 버튼 숨기기
    if (nextButton) nextButton.classList.add('hidden');
    if (prevButton) prevButton.classList.add('hidden');
  }
}

// 다시 시작 함수
function restartQuiz(): void {
  // 상태 초기화
  currentQuestionIndex = 0;
  userAnswers = new Array(questions.length).fill('');
  quizStarted = false;

  // UI 초기화
  resultContainer?.classList.add('hidden');
  questionContainer?.classList.remove('hidden');
  questionContainer?.classList.add('flex');

  // 시작 화면 표시
  showStartScreen();

  // 버튼 상태 및 진행바 초기화
  updateButtonStates();
  updateProgress(0);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
