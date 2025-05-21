import Swiper from 'swiper';
import { Mousewheel, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-cards';
import { saveViewedNews, isViewed } from '../storage.ts';

// 뉴스 데이터 인터페이스
interface NewsData {
  link: string;
  title: string;
  description: string;
  originallink: string;
  pubDate: string; // ISO 문자열 (날짜)
  keyword?: string; // 검색어
}

// ✅ 네이버 뉴스 API를 프록시를 통해 fetch하는 함수
async function fetchNaverNewsViaProxy(query: string): Promise<NewsData[]> {
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_NAVER_CLIENT_SECRET;
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
    console.log('API 응답:', data);
    return data.items.map((item: NewsData) => ({
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
  const swiperWrapper = document.querySelector('.swiper-wrapper') as HTMLElement;
  if (!swiperWrapper) return;

  swiperWrapper.innerHTML = '';

  const bgColors = ['bg-blue-500', 'bg-indigo-700', 'bg-blue-800', 'bg-sky-900'];

  newsData.forEach((news, index) => {
    const slideElement = document.createElement('div');
    slideElement.classList.add('swiper-slide');

    const bgColorClass = bgColors[index % bgColors.length];
    const isAlreadyViewed = isViewed(news.link);

    // 조건에 따라 클래스 설정
    const cardBgClass = isAlreadyViewed ? 'bg-gray-400' : bgColorClass;
    const titleColorClass = isAlreadyViewed ? 'text-gray-500' : 'text-white';
    const descColorClass = isAlreadyViewed ? 'text-gray-500' : 'text-white';
    const tagColorClass = isAlreadyViewed ? 'text-gray-500' : 'text-orange-500';
    const underlineClass = isAlreadyViewed ? 'bg-gray-500' : 'bg-gradient-to-r from-orange-500 to-orange-600';

    slideElement.innerHTML = `
    <div class="relative ${cardBgClass} rounded-2xl p-8 md:p-10 text-left shadow-xl">
      <div class="text-xl ${tagColorClass}">${query}</div>
      <div class="text-4xl pretendard mb-4 ${titleColorClass}">${news.title}</div>
      <p class="text-lg md:text-xl mb-6 ${descColorClass}">${news.description}</p>
      <a href="${news.link}" target="_blank" class="mt-3 text-gray-300 read-more">Read More</a>
      <div class="h-1 w-full max-w-xs mt-3 ${underlineClass}"></div>
    </div>
    `;

    swiperWrapper.appendChild(slideElement);
  });

  new Swiper('.mySwiper', {
    modules: [Mousewheel, EffectCards],
    effect: 'cards',
    grabCursor: true,
    loop: true,
    mousewheel: {
      forceToAxis: false,
      invert: false,
      sensitivity: 1,
      releaseOnEdges: true,
    },
    cardsEffect: {
      slideShadows: false, // 🔥 그림자 네모 생성 금지!
    },
  });
}

// ✅ 뉴스 검색 및 슬라이드 업데이트 트리거 함수
async function fetchAndRenderNews(query: string) {
  const news = await fetchNaverNewsViaProxy(query); // ✅ 함수 이름 주의! 네가 fetchNaverNewsViaProxy로 사용 중
  updateSwiperSlides(news, query);
  const arr = document.querySelectorAll('.swiper-slide');
  console.log(arr);
}

// ✅ DOM이 로드되면 초기화 + 검색 이벤트 바인딩
window.addEventListener('DOMContentLoaded', async () => {
  const defaultQuery = '경제';
  await fetchAndRenderNews(defaultQuery);

  const inputElement = document.getElementById('searchInput') as HTMLInputElement;
  if (inputElement) {
    inputElement.addEventListener('change', async () => {
      const keyword = inputElement.value.trim();
      if (keyword) {
        await fetchAndRenderNews(keyword);
      }
    });
  }

  document.addEventListener('click', e => {
    const target = e.target as HTMLElement;

    if (target.matches('.read-more')) {
      e.preventDefault(); // 링크 이동 막기
      const link = (target as HTMLAnchorElement).href;

      const slide = target.closest('.swiper-slide');
      const title = slide?.querySelector('.pretendard')?.textContent ?? '';
      const description = slide?.querySelector('p')?.textContent ?? '';
      const keyword = slide?.querySelector('.text-xl')?.textContent ?? ''; // query 텍스트

      // 저장
      saveViewedNews({
        link,
        title,
        description,
        originallink: link,
        pubDate: new Date().toISOString(), // 현재 날짜로 설정
        keyword,
      });

      // 🎨 카드 색 변경

      if (slide) {
        const title = slide.querySelector('.pretendard.mb-4');
        const desc = slide.querySelector('p');
        const tag = slide.querySelector('.text-orange-500'); // query 텍스트
        const gradient = slide.querySelector('.bg-gradient-to-r'); // 밑줄 div
        const card = target.closest('.relative');

        // ✅ query 텍스트 색상 회색으로
        if (tag) {
          tag.classList.remove('text-orange-500');
          tag.classList.add('text-gray-500');
        }

        // ✅ 하단 선 색상 회색으로 변경
        if (gradient) {
          gradient.classList.remove('bg-gradient-to-r', 'from-orange-500', 'to-orange-600');
          gradient.classList.add('bg-gray-500');
        }

        // ✅ 텍스트 흐림 처리
        title?.classList.remove('text-white');
        title?.classList.add('text-gray-500');

        desc?.classList.remove('text-white');
        desc?.classList.add('text-gray-500');

        // ✅ 배경도 흐리게
        if (card) {
          card.classList.remove('bg-blue-500', 'bg-indigo-700', 'bg-blue-800', 'bg-sky-900');
          card.classList.add('bg-gray-400');
        }
      }

      // ✅ 이동은 수동으로
      window.open(link, '_blank');
    }
  });
});
