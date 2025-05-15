import axios from 'axios';

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
      content: `다음 내용을 바탕으로 퀴즈를 생성해주세요. 출력 형식은 아래 JSON 형식을 정확히 따르세요:

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
"생성형 인공지능(AI)이 상상이 아닌 현실에 적용 가능한 도구로 자리잡았다는 것을 체험할 수 있습니다." 함기호 아마존웹서비스(AWS)코리아 대표는 14일 오전 서울 코엑스에서 개막한 'AWS 서밋 서울 2025' 기조연설에서 "올해 행사는 기술 중심에서 경험 중심으로의 전환을 본격화하는 무대"라며 이같이 말했다. 함 대표는 "AWS코리아는 지난해에 이어 올해도 생성형 AI 정보기술(IT) 현대화를 사업전략으로 실행하고 있다"며 "특히 한국은 어떤 국가보다도 AI 파운데이션 모델과 거대언어모델(LLM) 파트너십(협력관계)을 많이 만들고, 기업들의 해외진출을 지원한다"고 말했다. 이어 "고객들의 클라우드 전환 전략도 눈에 띄게 변화하고 있다"며 "과거엔 단순한 비용절감이나 리프트 앤 시프트(Lift & Shift·단순 이동) 방식을 선호했지만, 이제는 장기적 관점에서 사업 민첩성과 경쟁력 확보를 위해 클라우드 네이티브 환경으로의 전환을 더욱 중요하게 생각한다"고 했다. 함 대표는 또 AWS가 지난달 소프트웨어(SW)·데이터·서비스 등을 거래하는 자사 마켓플레이스를 한국으로 확장했다고 강조했다. 그는 "전 세계에서 수십조원의 거래가 마켓플레이스에서 이뤄지고, 실제로 고객 대부분이 마켓플레이스를 사용하고 있다"고 밝혔다. 공공 클라우드 시장에 대해선 공략 의지를 분명히 했다. 함 대표는 "AWS가 지난 3월 한국인터넷진흥원(KISA)으로부터 클라우드보안인증(CSAP) 하등급을 취득해 한국 공공기관에 클라우드 서비스를 제공할 수 있게 됐다"며 "공공기관도 AWS를 통해 공공서비스 혁신을 이룰 수 있다"고 말했다. AWS는 과학기술정보통신부의 '2023 부가통신사업 실태조사'에서 부가통신사업자 사용률 60.2%를 기록하는 등 국내 민간분야에서 고객·개발자층이 가장 두터운 클라우드제공사업자(CSP)다. 이날 행사에서도 현대카드·대한항공·크래프톤·LG유플러스 등 국내 유명 기업들이 AWS로 신규 서비스를 개발하거나 업무 효율을 개선했다고 소개했다. AWS 고객사 중 현대카드는 자체 개발한 결제정보 관련 인공지능(AI) 플랫폼을 지난해 10월 금융권 최초로 일본에 수출했다. 이 플랫폼은 AWS 인프라·서비스를 대거 활용한 바 있다. 배경화 현대카드 디지털부문 부사장은 이날 기조연설에서 "일본 외에 중동·유럽·호주 등지에서도 수출을 논의한다"며 "AWS를 통해 해외 진출에 쉽게 접근할 수 있었다"고 말했다. 인프라·서비스 경쟁력도 강조했다. 야세르 알사이에드 AWS 사물인터넷(IoT) 부문 부사장은 "600킬로미터가 넘는 광케이블로 모든 리전·가용영역·엣지를 연결했다"며 "지난 12개월만 하더라도 네트워크 백본 용량을 80% 증가시켰다"고 밝혔다. 알사이에드 부사장은 "엔비디아와 14년간 파트너십을 유지해 왔다"며 "블랙웰 그래픽처리장치(GPU)를 탑재한 'P6 패밀리 인스턴스'를 곧 출시할 예정이고, 세계 최대규모 AI 슈퍼컴퓨터 프로젝트 '세이바(Ceiba)' 구축도 함께한다"고 덧붙였다. 한편 이날 행사장에는 AWS와 고객사들의 체험·전시공간이 50곳 이상 설치됐다. 대한항공은 '아마존 베드록'을 활용해 가상 승무원을 구현한 'AI 크루', LG생활건강은 '아마존 레코그니션' 등으로 피부 상태를 진단하는 'AI 스킨케어'를 선보였다. AWS 서밋 서울은 AWS가 한국에서 여는 최대 규모 연례 행사로 올해 11주년을 맞았다. AWS코리아는 올해 130여개 세션과 60여건의 고객사례 발표를 준비했고, 4만여명이 사전등록을 마친 가운데 2만4000여명이 참석할 것으로 예상했다. 행사는 오는 15일까지 열린다.`,
    },
  ],
  response_format: { type: 'json_object' }, // JSON 형식으로 응답 요청
};

const quiz = document.querySelector('p');
const ulElem = document.querySelector('ul');

document.addEventListener('DOMContentLoaded', () => {
  axios
    .post(API_URL, data, { headers })
    .then(response => {
      console.log('전체 응답:', response.data); // 응답 데이터 확인

      try {
        const rawContent = response.data.choices[0].message.content;
        console.log('원본 내용:', rawContent); // 디버깅용

        // 마크다운 코드 블록 제거
        const jsonString = rawContent.replace(/^```json\n|\n```$/g, '');
        console.log('처리 후 JSON 문자열:', jsonString); // 디버깅용

        const quizData = JSON.parse(jsonString);

        // 문제 표시
        quiz.textContent = quizData.question;

        // 선택지 표시 (섞어서)
        const shuffledOptions = [...quizData.options].sort(() => Math.random() - 0.5);
        ulElem.innerHTML = ''; // 기존 내용 초기화

        shuffledOptions.forEach(opt => {
          const liElem = document.createElement('li');
          liElem.textContent = opt.text;
          liElem.addEventListener('click', () => {
            if (opt.isCorrect) {
              liElem.style.fontWeight = 'bold';
              liElem.style.backgroundColor = 'green';
              const points = JSON.parse(localStorage.getItem('points') || '[0]');
              const pointLog = JSON.parse(localStorage.getItem('pointLog') || '[]');

              pointLog.push(`기사 문제 정답`);
              points[0] = points[0] + 50;
              localStorage.setItem('points', JSON.stringify(points));
              localStorage.setItem('pointLog', JSON.stringify(pointLog));
            } else {
              liElem.style.fontWeight = 'bold';
              liElem.style.backgroundColor = 'red';
            }
          });

          ulElem.appendChild(liElem);
        });
      } catch (e) {
        console.error('JSON 파싱 오류:', e);
        quiz.textContent = '퀴즈 생성 중 오류가 발생했습니다.';
      }
    })
    .catch(error => {
      console.error('API 요청 오류:', error.response?.data || error.message);
      quiz.textContent = 'API 요청에 실패했습니다.';
    });
});
