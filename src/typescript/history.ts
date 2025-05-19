import type { NaverNewsItem } from './naverapi.ts';
document.addEventListener('DOMContentLoaded', () => {
  // 히스토리 기능 구현
  // 히스토리 log에서 본 기사 정보를 빼냄
  const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000';
  const history = JSON.parse(localStorage.getItem('history') || '[]') as unknown[];
  console.log(history);

  const section = document.querySelector('#newsGrid');

  // TODO 이미지 배경 색 바꾸기
  const renderCard = (article: NaverNewsItem) => {
    const card = document.createElement('a');
    card.href = article.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'flex flex-col rounded-lg overflow-hidden shadow-md bg-white h-full transition-transform hover:scale-[1.01]';

    card.innerHTML = `
    <div class="relative h-40 overflow-hidden">
      <img src="${article.image}" alt="${article.title}"
        class="w-full h-full object-cover"
        onerror="this.src='${fallbackImage}'"
      />
      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent ">
        <div class="flex justify-between items-center">
          <span class="text-xs text-white">${article.pubDate}</span>
        </div>
        <h3 class="text-white font-bold mt-1 line-clamp-2 h-[45px]">${article.title}</h3>
      </div>
    </div>
    <div class="p-4 flex flex-col flex-grow">
      <p class="text-sm text-gray-700 mb-4 flex-grow">${article.description}</p>
      <span class="text-blue-500 text-sm flex items-center hover:underline">
        자세히 보기 →
      </span>
    </div>
  `;

    // 누른 카드뉴스를 로그에 입력
    card.addEventListener('click', () => {
      console.log(`${card.href}를 눌렀습니다!`);
      const history = JSON.parse(localStorage.getItem('history') || '[]') as unknown[];
      if (!history.includes(article)) {
        history.push(article);
        localStorage.setItem('history', JSON.stringify(history));
      }
    });

    return card;
  };

  history?.forEach(hist => {
    if (section) section.appendChild(renderCard(hist as NaverNewsItem));
  });
});
