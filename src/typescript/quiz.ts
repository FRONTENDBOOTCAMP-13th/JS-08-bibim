import axios from 'axios';
import { updatePoint } from './updatePoint.ts';
import { renderPoint } from './updatePoint.ts';

console.log('hello');
// 맞춤 기사 부분
const quizStorage = JSON.parse(localStorage.getItem('quiz') || '["", "", "", ""]');
const title = quizStorage[0];
const description = quizStorage[1];
const arr = quizStorage[2];

// 가져온 10개 중에 지금 기사랑 중복되는게 있으면 제거
for (let i = 0; i < arr.length; i++) {
  if (arr[i].title == title) {
    arr.splice(i, 1);
    break;
  }
}

// 기사 제목에 <br/>과 ""를 제거하는 함수
function makeCleanTxt(value: string) {
  const txt = document.createElement('textarea');
  txt.innerHTML = value;
  const decoded = txt.value;

  // <b>와 </b> 태그만 제거
  const cleanText = decoded.replace(/<\/?b>/g, '');

  // 텍스트 노드로 변환
  // const title = document.createTextNode(cleanText);

  return cleanText;
}

// 여기는 맞춤 뉴스 기사
document.addEventListener('DOMContentLoaded', () => {
  const recommandTitle = document.querySelectorAll('.recommand-title');
  const recommandDescription = document.querySelectorAll('.recommand-description');
  const recommandDate = document.querySelectorAll('.recommand-date');

  for (let i = 0; i < 6; i++) {
    recommandTitle[i].textContent = makeCleanTxt(arr[i].title);
    recommandDescription[i].textContent = makeCleanTxt(arr[i].description);
    recommandDate[i].textContent = arr[i].date;

    recommandTitle[i].parentElement?.addEventListener('click', () => {
      window.open(`${arr[i].link}`, '_blank');
    });
  }
});

// 아래는 퀴즈 section
// const API_KEYS = `${import.meta.env.VITE_DEEPSEEK_API_KEY}`;
const API_KEYS = [`${import.meta.env.VITE_GEMMA_API_KEY_HYUNJI}`, `${import.meta.env.VITE_GEMMA_API_KEY_HYUNJI2}`, `${import.meta.env.VITE_GEMMA_API_KEY_HYUNJI3}`, `${import.meta.env.VITE_GEMMA_API_KEY_YEONO}`, `${import.meta.env.VITE_GEMMA_API_KEY_YEONO2}`, `${import.meta.env.VITE_GEMMA_API_KEY_SEONJIN}`, `${import.meta.env.VITE_GEMMA_API_KEY_KYUNGMIN}`, `${import.meta.env.VITE_GEMMA_API_KEY_KYUNGMIN2}`, `${import.meta.env.VITE_DEEPSEEK_API_KEY}`];
// const API_KEY = ``;
// const API_KEY = ``;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// const API_URL = '';
/* 
meta-llama/llama-3.3-8b-instruct:free 다른 언어가 나옴
google/gemma-3n-e4b-it:free
nousresearch/deephermes-3-mistral-24b-preview:free ***
microsoft/phi-4-reasoning-plus:free 그냥 쓰레기
microsoft/phi-4-reasoning:free 개쓰레기
opengvlab/internvl3-14b:free ***

*/
const data = {
  model: 'opengvlab/internvl3-14b:free',
  messages: [
    {
      role: 'user',
      content: `다음 내용에서 키워드 3개를 골라 각 키워드에 대한 토막 상식 퀴즈를 내주세요. 총 3문제입니다.
        **출력 형식은 아래 JSON 형식을 정확히 따르세요.**
        텍스트로 적으세요.
        출력 형식 의외의 출력 절대 금지.
        정확히 따라주세요!! 특히 options를 잘 따라주세요.
        options의 isCorrect에서 2개는 false, 1개는 true로 설정하고, 잘 섞어주세요.
        **전부 한국어로 변환해서 출력하세요**:
  
  {
    "question": "생성된 문제 (한 줄 질문)",
    "options": [
      {"text": "선택지1", "isCorrect": false},
      {"text": "선택지2", "isCorrect": false},
      {"text": "선택지3", "isCorrect": true}
    ],
    "explanation": "정답에 대한 간단한 설명"
  }
  
  {
    "question": "생성된 문제 (한 줄 질문)",
    "options": [
      {"text": "선택지1", "isCorrect": true},
      {"text": "선택지2", "isCorrect": false},
      {"text": "선택지3", "isCorrect": false}
    ],
    "explanation": "정답에 대한 간단한 설명"
  }

  {
    "question": "생성된 문제 (한 줄 질문)",
    "options": [
      {"text": "선택지1", "isCorrect": false},
      {"text": "선택지2", "isCorrect": true},
      {"text": "선택지3", "isCorrect": false}
    ],
    "explanation": "정답에 대한 간단한 설명"
  }
  
  생성할 내용:
  ${title}
  ${description}`,
    },
  ],
  // response_format: { type: 'json_object' }, // JSON 형식으로 응답 요청
};

async function callApiWithKeys() {
  for (let i = 0; i < API_KEYS.length; i++) {
    const API_KEY = API_KEYS[i];
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      let ans = `데이터를 불러오지 못했습니다.`;
      await axios.post(API_URL, data, { headers }).then(response => {
        console.log('API 호출 성공:', response.data);
        ans = response.data.choices[0].message.content;
      });
      return ans; // 성공하면 결과 반환 후 종료
    } catch (error: unknown) {
      console.warn(`API 호출 실패, API_KEY 교체 시도 ${i + 1}:`, error);
      await new Promise(r => setTimeout(r, 1000));
      // 실패 시 다음 API_KEY로 시도
    }
  }

  for (let i = 0; i < API_KEYS.length; i++) {
    const API_KEY = API_KEYS[i];
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      let ans = `데이터를 불러오지 못했습니다.`;
      data.model = 'nousresearch/deephermes-3-mistral-24b-preview:free';
      await axios.post(API_URL, data, { headers }).then(response => {
        console.log('API 호출 성공:', response.data);
        ans = response.data.choices[0].message.content;
      });
      return ans; // 성공하면 결과 반환 후 종료
    } catch (error: unknown) {
      console.warn(`API 호출 실패, API_KEY 교체 시도 ${i + 1}:`, error);
      // 실패 시 다음 API_KEY로 시도
    }
  }

  // 에러 메시지
  const errorMsg = document.createElement('div');
  errorMsg.innerHTML = `API 키에 다음과 같은 오류가 생겼습니다.<br/>1. API 키 요청 한도가 끝이 남.<br/>2. 일시적으로 모델의 사용량이 증가하여 제대로 동작을 하지 않음.<br/>새로고침을 눌러주세요.`;
  errorMsg.classList = 'w-full max-w-md mx-auto text-center my-10 shadow bg-white py-5 rounded-lg';

  // Main Content 내 퀴즈 섹션을 찾아서 내용 비우고 이미지 삽입
  const quizSection = document.querySelector('div.lg\\:col-span-2 section') as HTMLElement;

  if (quizSection) {
    quizSection.innerHTML = ''; // 기존 퀴즈 내용 제거
    quizSection.appendChild(errorMsg);
  }
  throw new Error('모든 API 호출이 실패했습니다.');
}

interface Quiz {
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

function extractJsonBlocks(text: string): Quiz[] {
  const results: object[] = [];
  let depth = 0;
  let buffer = '';
  let inside = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '{') {
      if (!inside) inside = true;
      depth++;
    }

    if (inside) buffer += char;

    if (char === '}') {
      depth--;
      if (depth === 0 && inside) {
        try {
          results.push(JSON.parse(buffer));
        } catch {
          console.warn('잘못된 JSON 블록 무시됨:', buffer);
        }
        buffer = '';
        inside = false;
      }
    }
  }

  return results as Quiz[];
}

function isValidQuizData(data: Quiz): boolean {
  if (typeof data !== 'object' || typeof data.question !== 'string' || !Array.isArray(data.options) || data.options.length === 0 || typeof data.explanation !== 'string') {
    return false;
  }

  for (const option of data.options) {
    if (typeof option !== 'object' || typeof option.text !== 'string' || typeof option.isCorrect !== 'boolean') {
      return false;
    }
  }

  return true;
}

document.addEventListener('DOMContentLoaded', async () => {
  const quizProblems = document.querySelectorAll('[name="quizProblem"]');
  const options = document.querySelectorAll('.option');
  const quizFeedbacks = document.querySelectorAll('.quiz-feedback');
  const quizResult = document.querySelectorAll('[name="quiz-result"]');
  const quizReason = document.querySelectorAll('[name="quiz-reason"]');
  const quizPoints = document.querySelectorAll('[name="quiz-points"]');
  const retryBtns = document.querySelectorAll('.retry');

  const points = JSON.parse(localStorage.getItem('points') || '[0]');
  const pointLog = JSON.parse(localStorage.getItem('pointLog') || '[]') as {
    date: string;
    log: string;
  }[];

  const response = await callApiWithKeys();
  console.log('메세지:', response);

  try {
    const rawContent = response;

    const quizData = extractJsonBlocks(rawContent);
    console.log('퀴즈 데이터:', quizData);
    for (let i = 0; i < 3; i++) {
      if (!isValidQuizData(quizData[i])) throw new Error('AI가 데이터를 제대로 출력하지 못했습니다.');
    }

    quizData?.forEach((data, i) => {
      // 문제
      if (quizProblems[i]) {
        quizProblems[i].textContent = `${i + 1}. ${data.question}`;
        quizProblems[i].classList.add('mb-2');
      }

      // 선택지
      for (let j = 0; j < 3; j++) {
        const liElem = document.createElement('li');
        liElem.className = 'p-3 rounded-lg cursor-pointer border border-gray-200 hover:shadow-lg focus:shadow-lg hover:bg-blue-100 hover:outline-none hover:ring-2 hover:ring-[#0070F3] focus:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-[#0070F3] my-1';

        const innerDiv = document.createElement('div');
        innerDiv.className = 'flex items-center';

        const circleDiv = document.createElement('div');
        circleDiv.className = 'h-5 w-5 rounded-full border border-gray-200 mr-3 flex items-center justify-center';

        const checkSpan = document.createElement('span');
        checkSpan.textContent = '✓';
        checkSpan.className = 'text-sm text-[#005DBA]';

        const spanElem = document.createElement('span');
        const textElem = document.createTextNode(data.options[j].text);

        spanElem.appendChild(textElem);
        innerDiv.appendChild(circleDiv);
        innerDiv.appendChild(spanElem);
        liElem.appendChild(innerDiv);

        liElem.addEventListener('click', () => {
          circleDiv.appendChild(checkSpan);

          if (quizFeedbacks[i]) {
            quizFeedbacks[i].classList.remove('hidden');
          }
          if (options[i].classList.contains('answered'))
            // 이미 정답을 선택했는지 확인
            return;

          if (data.options[j].isCorrect) {
            liElem.classList.add('bg-green-300', 'border-2', 'border-green-500');

            // 피드백
            //  + '\n' + data.explanation
            if (quizResult[i]) {
              quizResult[i].textContent = '축하드립니다! 정답을 맞히셨습니다!';
              quizResult[i].classList.contains('text-green-500');
            }
            if (quizReason[i]) quizReason[i].textContent = data.explanation;
            const isExist = pointLog.some(entry => entry.log.includes(`${data.question} 퀴즈 정답`));
            if (!isExist) {
              updatePoint(50, `${data.question} 퀴즈 정답`);
              points[0] += 50;
              if (quizPoints[i]) {
                quizPoints[i].textContent = `50 포인트가 적립 되었습니다. 현재 당신의 포인트는 총 ${points[0]}점 입니다.`;
                renderPoint();
              }
            } else {
              if (quizPoints[i]) quizPoints[i].textContent = `현재 당신의 포인트는 총 ${points[0]}점 입니다.`;
            }
          } else {
            liElem.classList.add('bg-red-300', 'border-2', 'border-red-500');
            // 피드백
            if (quizResult[i]) {
              quizResult[i].textContent = '정답이 아닙니다. 다시 선택 해주세요.';
              quizResult[i].classList.contains('text-red-500 ');
            }
          }

          // 다른 선택지 클릭 못 하도록 클래스 추가
          options[i].classList.add('answered');

          // 모든 li에 클릭 비활성화
          const allLi = options[i].querySelectorAll('li');
          allLi.forEach(li => {
            li.style.pointerEvents = 'none';
          });
        });

        if (options) {
          options[i].appendChild(liElem);
        }
      }

      // 재시작
      retryBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          // 선택지 초기화
          options[index].classList.remove('answered');
          options[index].innerHTML = ''; // li 요소 모두 제거

          // 피드백 초기화
          if (quizResult[index]) quizResult[index].textContent = '';
          if (quizReason[index]) quizReason[index].textContent = '';
          if (quizPoints[index]) quizPoints[index].textContent = '';
          if (quizFeedbacks[index]) quizFeedbacks[index].classList.add('hidden');

          // 다시 선택지 생성
          const currentData = quizData[index];
          for (let j = 0; j < 3; j++) {
            const liElem = document.createElement('li');
            liElem.className = 'p-3 rounded-lg cursor-pointer border border-gray-200 hover:border-[#005DBA]/50 my-1';

            const innerDiv = document.createElement('div');
            innerDiv.className = 'flex items-center';

            const circleDiv = document.createElement('div');
            circleDiv.className = 'h-5 w-5 rounded-full border border-gray-200 mr-3 flex items-center justify-center';

            const spanElem = document.createElement('span');
            const textElem = document.createTextNode(currentData.options[j].text);
            spanElem.appendChild(textElem);

            innerDiv.appendChild(circleDiv);
            innerDiv.appendChild(spanElem);
            liElem.appendChild(innerDiv);

            liElem.addEventListener('click', () => {
              if (quizFeedbacks[index]) quizFeedbacks[index].classList.remove('hidden');
              if (options[index].classList.contains('answered')) return;

              // 다른 선택지 초기화
              const allLi = options[index].querySelectorAll('li');
              allLi.forEach(li => {
                li.classList.remove('bg-green-300', 'bg-red-300');
                const circle = li.querySelector('.h-5.w-5');
                if (circle) circle.innerHTML = '';
                li.style.pointerEvents = 'none';
              });

              // 현재 항목에 체크 추가 (매번 새로운 span 생성)
              const checkSpan = document.createElement('span');
              checkSpan.textContent = '✓';
              checkSpan.className = 'text-sm text-[#005DBA]';
              circleDiv.appendChild(checkSpan);

              if (currentData.options[j].isCorrect) {
                liElem.classList.add('bg-green-300', 'border-2', 'border-green-500');
                if (quizResult[index]) quizResult[index].textContent = '축하드립니다! 정답을 맞히셨습니다!';
                if (quizReason[index]) quizReason[index].textContent = currentData.explanation;
                if (quizPoints[index]) {
                  quizPoints[index].textContent = `현재 당신의 포인트는 총 ${points[0]}점 입니다.`;
                }
              } else {
                liElem.classList.add('bg-red-300', 'border-2', 'border-red-500');
                if (quizResult[index]) quizResult[index].textContent = '정답이 아닙니다. 다시 선택 해주세요.';
                if (quizReason[index]) quizReason[index].textContent = currentData.explanation;
              }

              options[index].classList.add('answered');
            });

            options[index].appendChild(liElem);
          }
        });
      });
    });
  } catch (err) {
    console.error(err);

    // 에러 이미지 생성
    const errorImg = document.createElement('img');
    errorImg.src = '/src/pages/webp/503error.webp';
    errorImg.alt = '서비스 에러 이미지';
    errorImg.className = 'w-full max-w-md mx-auto mt-10 rounded-lg';

    // 에러 메시지
    const errorMsg = document.createElement('div');
    errorMsg.innerHTML = `AI가 데이터를 제대로 출력하지 못했습니다.<br/>새로고침을 눌러주세요.`;
    errorMsg.classList = 'w-full max-w-md mx-auto text-center mt-10 shadow bg-white py-5 rounded-lg';

    // Main Content 내 퀴즈 섹션을 찾아서 내용 비우고 이미지 삽입
    const quizSection = document.querySelector('div.lg\\:col-span-2 section') as HTMLElement;

    if (quizSection) {
      quizSection.innerHTML = ''; // 기존 퀴즈 내용 제거
      quizSection.appendChild(errorImg);
      quizSection.appendChild(errorMsg);
    }
  }
});
