import Swiper from 'swiper';
import { Mousewheel, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-cards';

const swiper = new Swiper('.mySwiper', {
  effect: 'cards',
  grabCursor: true, // 마우스 커서가 카드 잡는 모양으로 변함
  mousewheel: {
    forceToAxis: false,
    invert: false,
    sensitivity: 1,
    releaseOnEdges: true,
  },
  modules: [Mousewheel, EffectCards],
});

// 뉴스 데이터 인터페이스
interface NewsData {
  title: string;
  description: string;
  link: string;
}

// ✅ 네이버 뉴스 API를 프록시를 통해 fetch하는 함수
async function fetchNaverNewsViaProxy(query: string): Promise<NewsData[]> {
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
  const url = `https://fesp-api.koyeb.app/proxy/v1/search/news.json?query=${encodeURIComponent(query)}&display=10&sort=date`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Naver-Client-Id': clientId, // 네이버 애플리케이션 Client ID
        'X-Naver-Client-Secret': clientSecret, // 네이버 애플리케이션 Secret
        'X-Target-Url': 'https://openapi.naver.com', // optional, 기본값이라 생략 가능
      },
    });

    if (!response.ok) {
      throw new Error('네이버 뉴스 API 호출 실패!');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      title: item.title.replace(/<b>/g, '').replace(/<\/b>/g, ''),
      description: item.description.replace(/<b>/g, '').replace(/<\/b>/g, ''),
      link: item.link,
    }));
  } catch (err) {
    console.error('❌ 네이버 API 오류:', err);
    return [];
  }
}

// ✅ 슬라이드 업데이트 함수
function updateSwiperSlides(newsData: NewsData[], query: string): void {
  const swiperWrapper = document.querySelector(
    '.swiper-wrapper',
  ) as HTMLElement;
  if (!swiperWrapper) return;

  swiperWrapper.innerHTML = '';

  const bgColors = [
    'bg-blue-500',
    'bg-indigo-700',
    'bg-blue-800',
    'bg-sky-900',
  ];

  newsData.forEach((news, index) => {
    const slideElement = document.createElement('div');
    slideElement.classList.add('swiper-slide');

    const bgColorClass = bgColors[index % bgColors.length];

    slideElement.innerHTML = `
      <div class="relative ${bgColorClass} rounded-2xl p-8 md:p-10 text-left text-white shadow-lg">
        <div class="text-xl text-orange-500">${query}</div>
        <div class="text-4xl pretendard mb-4">${news.title}</div>
        <p class="text-lg md:text-xl mb-6">${news.description}</p>
        <a href="${news.link}" target="_blank" class="mt-3 text-gray-300">Read More</a>
        <div class="h-1 w-full max-w-xs bg-gradient-to-r from-orange-500 to-orange-600 mt-3"></div>
      </div>
    `;

    swiperWrapper.appendChild(slideElement);
  });

  if ((window as any).swiperInstance) {
    (window as any).swiperInstance.update();
  } else {
    (window as any).swiperInstance = new Swiper('.mySwiper', {
      modules: [EffectCards],
      effect: 'cards',
      grabCursor: true,
      loop: true,
    });
  }
}

// ✅ 페이지 로드시 뉴스 데이터 받아오기
window.addEventListener('DOMContentLoaded', async () => {
  const query = '경제'; // 검색어 지정
  const news = await fetchNaverNewsViaProxy(query);
  updateSwiperSlides(news, query);
});
