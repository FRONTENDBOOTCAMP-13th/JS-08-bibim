// 전체 DOM이 로드 됐을때 시작
document.addEventListener('DOMContentLoaded', () => {
  // 카테고리 별 버튼 객체들을 buttons에 저장
  // buttons = {'종합', '정치', ...}
  const buttons = document.querySelectorAll('button');

  const article = document.querySelector('article');

  // 각각 버튼들에게 getArticle 함수를 이벤트로 걸어줌
  for (const btn of buttons) {
    const category = btn.textContent;
    btn.addEventListener('click', () => {
      if (category) getArticle(category);
    });
  }

  function getArticle(category: string): void {
    // TODO Article을 보여주는 코드 작성
    // 예시 코드

    const divElem = document.createElement('div');
    const h2Elem = document.createElement('h2');
    const contentElem = document.createElement('p');

    const h2Txt = document.createTextNode(`[${category}] 기사 제목입니다.`);
    const contentTxt = document.createTextNode(
      'AI 코딩 도구를 활용하면 코드 생성 및 자동화, 개발 워크플로우와의 통합 등이 가능하며 기존 개발 환경 대비 생산성을 높일 수 있습니다. 그러나 개발자를 꿈꾸며 학습을하는 예비 개발자에게 AI 코딩 도구는 양날의 검이 될 수 있습니다. AI 코딩 도구에만 의존하는 주니어 개발자는 경쟁력을 갖출 수 없기 때문입니다. 오히려 더 깊이 있게 언어를 학습하고 좋은 질문을 할 수 있도록 문해력(Literacy)을 기르는 것이 필요합니다. 다만 AI 도구를 완전히 배제하는 것이 아닌 학습을 위한 파트너로서 활용할 것을 추천합니다.',
    );

    h2Elem.appendChild(h2Txt);
    contentElem.appendChild(contentTxt);
    divElem.appendChild(h2Elem);
    divElem.appendChild(contentElem);

    article?.replaceChildren(divElem);
  }
});
