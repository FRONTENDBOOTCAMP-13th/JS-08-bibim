import { naverNews } from './naverapi.ts';
import type { NaverNewsItem } from './naverapi.ts';

const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000';

// interface Article {
//   id: number;
//   image: string;
//   category: string;
//   date: string;
//   title: string;
//   description: string;
//   url: string;
// }
// 임시 뉴스 데이터 (API 데이터 매핑 예정)
// const articles: Article[] = [
//   {
//     id: 1,
//     image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
//     category: '테크뉴스',
//     date: '5월 15일 오전 11:06',
//     title: '삼성전자, 신형 스마트폰 출시 예정',
//     description: '삼성전자가 더욱 더 혁신적인 기능을 탑재한 새로운 스마트폰을 출시할 예정이라고 발표했습니다.',
//     url: '#',
//   },
//   {
//     id: 2,
//     image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
//     category: '경제정보',
//     date: '5월 15일 오전 11:06',
//     title: '2024년 경제 전망: 전문가들의 분석',
//     description: '국내외 경제 전문가들이 2024년 경제 상황과 주요 경제 지표에 대한 전망을 내놓았습니다.',
//     url: '#',
//   },
// ];

const keyword = '정치';
const articles: NaverNewsItem[] | undefined = await naverNews(keyword, 21);

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
        <span class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md">${keyword}</span>
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

const newsGrid = document.getElementById('newsGrid');
articles?.forEach(article => {
  if (newsGrid) newsGrid.appendChild(renderCard(article));
});
