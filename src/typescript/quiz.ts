import axios from 'axios';
import { updatePoint } from './updatePoint.ts';
import { renderPoint } from './updatePoint.ts';

console.log('hello');
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

console.log(title, description, arr);

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
    console.log(makeCleanTxt(arr[i].title));

    recommandTitle[i].textContent = makeCleanTxt(arr[i].title);
    recommandDescription[i].textContent = makeCleanTxt(arr[i].description);
    recommandDate[i].textContent = arr[i].date;

    recommandTitle[i].parentElement?.addEventListener('click', () => {
      window.open(`${arr[i].link}`, '_blank');
    });
  }
});

// 아래는 퀴즈 section
const API_KEY = `${import.meta.env.VITE_DEEPSEEK_API_KEY}`;
// const API_KEY = ``;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// const API_URL = '';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};
const data = {
  model: 'deepseek/deepseek-chat:free',
  messages: [
    {
      role: 'user',
      content: `다음 내용에서 키워드 3개를 골라 각 키워드에 대한 토막 상식 퀴즈를 내주세요. 총 3문제입니다.
        출력 형식은 아래 JSON 형식을 정확히 따르세요.
        텍스트로 적으세요.
        출력 형식 의외의 출력 절대 금지.
        아래 형식 좀 제발 따라줘...
        문제는 한국어로 출력하세요:
  
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
      {"text": "선택지1", "isCorrect": false},
      {"text": "선택지2", "isCorrect": false},
      {"text": "선택지3", "isCorrect": true}
    ],
    "explanation": "정답에 대한 간단한 설명"
  }

  {
    "question": "생성된 문제 (한 줄 질문)",
    "options": [
      {"text": "선택지1", "isCorrect": false},
      {"text": "선택지2", "isCorrect": false},
      {"text": "선택지3", "isCorrect": true}
    ],
    "explanation": "정답에 대한 간단한 설명"
  }
  
  생성할 내용:
  ${title}
  ${description}
  `,
    },
  ],
  response_format: { type: 'json_object' }, // JSON 형식으로 응답 요청
};

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

document.addEventListener('DOMContentLoaded', () => {
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

  axios.post(API_URL, data, { headers }).then(response => {
    console.log('전체 응답:', response.data);

    console.log('메세지:', response.data.choices[0].message.content);

    try {
      // let rawContent;

      const rawContent = response.data.choices[0].message.content;

      console.log('원본 내용:', rawContent);

      const quizData = extractJsonBlocks(rawContent);
      console.log('퀴즈 데이터:', quizData);

      quizData?.forEach((data, i) => {
        console.log(data.question);
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
          console.log(data.options[j].text);
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
              liElem.classList.add('bg-green-300');

              // 피드백
              //  + '\n' + data.explanation
              if (quizResult[i]) {
                quizResult[i].textContent = '축하드립니다! 정답을 맞히셨습니다!';
                quizResult[i].classList.contains('text-green-500 hover:border-[#22c55e]/50');
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
              liElem.classList.add('bg-red-300');
              // 피드백
              if (quizResult[i]) {
                quizResult[i].textContent = '정답이 아닙니다. 다시 선택 해주세요.';
                quizResult[i].classList.contains('text-red-500 hover:border-[#ef4444]/50');
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

              const checkSpan = document.createElement('span');
              checkSpan.textContent = '✓';
              checkSpan.className = 'text-sm text-[#005DBA]';

              const spanElem = document.createElement('span');
              const textElem = document.createTextNode(currentData.options[j].text);
              spanElem.appendChild(textElem);

              innerDiv.appendChild(circleDiv);
              innerDiv.appendChild(spanElem);
              liElem.appendChild(innerDiv);

              liElem.addEventListener('click', () => {
                if (quizFeedbacks[index]) quizFeedbacks[index].classList.remove('hidden');
                if (options[index].classList.contains('answered')) return;

                // 다른 선택지들 초기화 (체크 제거, 색상 제거)
                const allLi = options[index].querySelectorAll('li');
                allLi.forEach(li => {
                  li.classList.remove('bg-green-300', 'bg-red-300');
                  const circle = li.querySelector('.h-5.w-5');
                  if (circle) circle.innerHTML = '';
                  li.style.pointerEvents = 'none'; // 클릭 비활성화
                });

                // 현재 항목에 체크 추가
                circleDiv.appendChild(checkSpan);

                if (currentData.options[j].isCorrect) {
                  liElem.classList.add('bg-green-300 hover:border-[#22c55e]/50');
                  if (quizResult[index]) quizResult[index].textContent = '축하드립니다! 정답을 맞히셨습니다!';
                  if (quizReason[index]) quizReason[index].textContent = currentData.explanation;

                  if (quizPoints[index]) {
                    quizPoints[index].textContent = `현재 당신의 포인트는 총 ${points[0]}점 입니다.`;
                  }
                } else {
                  liElem.classList.add('bg-red-300 hover:border-[#ef4444]/50');
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
      errorImg.className = 'w-full max-w-md mx-auto mt-10';

      // 에러 메시지
      const errorMsg = document.createElement('div');
      errorMsg.textContent = 'AI와의 연결 실패. 새로고침을 눌러주세요.';
      errorMsg.classList = 'w-full max-w-md mx-auto text-center mt-10 shadow fill-white';

      // Main Content 내 퀴즈 섹션을 찾아서 내용 비우고 이미지 삽입
      const quizSection = document.querySelector('div.lg\\:col-span-2 section') as HTMLElement;

      if (quizSection) {
        quizSection.innerHTML = ''; // 기존 퀴즈 내용 제거
        quizSection.appendChild(errorImg);
        quizSection.appendChild(errorMsg);
      }
    }
  });
});
