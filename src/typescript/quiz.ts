import axios from 'axios';

console.log('hello');
const API_KEY = `${import.meta.env.VITE_DEEPSEEK_API_KEY}`;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

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

생성할 내용:
[오늘의 날씨] 맑고 포근한 일요일…낮 최고기온 24도
사진=연합뉴스 18일은 전국이 맑고 포근하겠다. 아침 최저기온은 8∼17도, 낮 최고기온은 18∼24도로 예보됐다. 미세먼지 농도는 원활한 대기 확산으로 전 권역이 '좋음' 수준을 보이겠다. 바다 물결은 동해·서해... 
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
  const quizProblems = document.querySelectorAll('.quizProblem');
  const options = document.querySelectorAll('.option');
  const feedbacks = document.querySelectorAll('.quiz-feedback');
  const retryBtns = document.querySelectorAll('.retry');

  const points = JSON.parse(localStorage.getItem('points') || '[0]');
  const pointLog = JSON.parse(localStorage.getItem('pointLog') || '[]');

  axios.post(API_URL, data, { headers }).then(response => {
    console.log('전체 응답:', response.data);

    try {
      const rawContent = response.data.choices[0].message.content;
      console.log('원본 내용:', rawContent);

      const quizData = extractJsonBlocks(rawContent);
      console.log('퀴즈 데이터:', quizData);

      quizData?.forEach((data, i) => {
        console.log(data.question);
        // 문제
        if (quizProblems[i]) quizProblems[i].textContent = data.question;

        // 선택지
        for (let j = 0; j < 3; j++) {
          const liElem = document.createElement('li');
          const textElem = document.createTextNode(data.options[j].text);

          liElem.appendChild(textElem);
          liElem.addEventListener('click', () => {
            // 이미 정답을 선택했는지 확인
            if (options[i].classList.contains('answered')) return;

            if (data.options[j].isCorrect) {
              liElem.style.backgroundColor = 'green';

              // 피드백
              if (feedbacks[i]) feedbacks[i].textContent = '정답입니다!' + '\n' + data.explanation;
              if (!pointLog.includes(`${data.question} 문제 정답`)) {
                // TODO 기사 제목 + j을 입력받아 여기에 저장
                pointLog.push(`${data.question} 문제 정답`);
                points[0] = points[0] + 50;
                localStorage.setItem('points', JSON.stringify(points));
                localStorage.setItem('pointLog', JSON.stringify(pointLog));
                if (feedbacks[i]) feedbacks[i].innerHTML += '<br/>50 포인트 획득!';
              }
            } else {
              liElem.style.backgroundColor = 'red';

              // 피드백
              if (feedbacks[i]) feedbacks[i].textContent = '틀렸습니다.' + '\n' + data.explanation;
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
            if (feedbacks[index]) feedbacks[index].textContent = '';

            // 다시 선택지 생성
            const currentData = quizData[index];
            for (let j = 0; j < 3; j++) {
              const liElem = document.createElement('li');
              const textElem = document.createTextNode(currentData.options[j].text);
              liElem.appendChild(textElem);

              liElem.addEventListener('click', () => {
                if (options[index].classList.contains('answered')) return;

                if (currentData.options[j].isCorrect) {
                  liElem.style.backgroundColor = 'green';
                  if (feedbacks[index]) feedbacks[index].textContent = '정답입니다!\n' + currentData.explanation;
                } else {
                  liElem.style.backgroundColor = 'red';
                  if (feedbacks[index]) feedbacks[index].textContent = '틀렸습니다.\n' + currentData.explanation;
                }

                options[index].classList.add('answered');
                const allLi = options[index].querySelectorAll('li');
                allLi.forEach(li => {
                  li.style.pointerEvents = 'none';
                });
              });

              options[index].appendChild(liElem);
            }
          });
        });
      });
    } catch {
      console.log('bye');
    }
  });
});
