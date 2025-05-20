import Swiper from 'swiper';
import { Mousewheel, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/effect-cards';
import { saveViewedLink, isViewed } from '../storage.ts';

// 뉴스 데이터 인터페이스
interface NewsData {
  title: string;
  description: string;
  link: string;
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
    const isAlreadyViewed = isViewed(news.link); // ✅ 확인
    const opacityClass = isAlreadyViewed ? 'opacity-50' : '';

    slideElement.innerHTML = `
      <div class="relative ${bgColorClass} ${opacityClass} rounded-2xl p-8 md:p-10 text-left text-white shadow-lg ">
        <div class="text-xl text-orange-500">${query}</div>
        <div class="text-4xl pretendard mb-4">${news.title}</div>
        <p class="text-lg md:text-xl mb-6">${news.description}</p>
        <a href="${news.link}" target="_blank" class="mt-3 text-gray-300 read-more">Read More</a>
        <div class="h-1 w-full max-w-xs bg-gradient-to-r from-orange-500 to-orange-600 mt-3"></div>
      </div>
    `;

    swiperWrapper.appendChild(slideElement);
  });

  // if (window.swiperInstance) {
  //   window.swiperInstance.update();
  // } else {
  //   window.swiperInstance = new Swiper('.mySwiper', {
  //     modules: [Mousewheel, EffectCards],
  //     effect: 'cards',
  //     grabCursor: true,
  //     loop: true,
  //     mousewheel: {
  //       forceToAxis: false,
  //       invert: false,
  //       sensitivity: 1,
  //       releaseOnEdges: true,
  //     },
  //   });
  // }
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
  });
}

// ✅ 뉴스 검색 및 슬라이드 업데이트 트리거 함수
async function fetchAndRenderNews(query: string) {
  const news = await fetchNaverNewsViaProxy(query); // ✅ 함수 이름 주의! 네가 fetchNaverNewsViaProxy로 사용 중
  updateSwiperSlides(news, query);
}

// ✅ DOM이 로드되면 초기화 + 검색 이벤트 바인딩
window.addEventListener('DOMContentLoaded', async () => {
  const defaultQuery = '경제';
  await fetchAndRenderNews(defaultQuery);

  const inputElement = document.getElementById(
    'searchInput',
  ) as HTMLInputElement;
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

      // 🔐 저장
      saveViewedLink(link);

      // 🎨 카드 색 변경
      const slide = target.closest('.swiper-slide');
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
          gradient.classList.remove(
            'bg-gradient-to-r',
            'from-orange-500',
            'to-orange-600',
          );
          gradient.classList.add('bg-gray-500');
        }

        // ✅ 텍스트 흐림 처리
        title?.classList.remove('text-white');
        title?.classList.add('text-gray-500');

        desc?.classList.remove('text-white');
        desc?.classList.add('text-gray-500');

        // ✅ 배경도 흐리게
        if (card) {
          card.classList.remove(
            'bg-blue-500',
            'bg-indigo-700',
            'bg-blue-800',
            'bg-sky-900',
          );
          card.classList.add('bg-gray-400');
        }
      }

      // ✅ 이동은 수동으로
      window.open(link, '_blank');
    }
  });
});
