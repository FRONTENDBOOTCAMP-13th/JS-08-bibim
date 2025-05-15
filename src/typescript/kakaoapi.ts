// const KAKAO_API_KEY = '0d170aae0300af5803e982454cbb689a';
// const keyword = '롯데자이언츠';

// async function KakaoNews() {
//   // 웹 검색 API를 사용하여 뉴스 검색 (site: 연산자로 뉴스 사이트 필터링)
//   const newsQuery = `${keyword} (site:news.naver.com OR site:v.daum.net OR site:news.joins.com OR site:news.chosun.com)`;
//   const URL = `https://dapi.kakao.com/v2/search/web?query=${encodeURIComponent(newsQuery)}&size=10&page=1`;

//   fetch(URL, {
//     method: 'GET',
//     headers: {
//       Authorization: `KakaoAK ${KAKAO_API_KEY}`,
//     },
//   })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));
// }

// KakaoNews();

// Swiper 모듈 import
// Swiper Init
// import Swiper from 'swiper';
// import 'swiper/css';
// import 'swiper/css/effect-cards';
// import { EffectCards } from 'swiper/modules';

// window.addEventListener('DOMContentLoaded', () => {
//   new Swiper('.mySwiper', {
//     modules: [EffectCards],
//     effect: 'cards',
//     grabCursor: true,
//   });
// });

// /// kakao API로 변경

interface NewsData {
  title: string;
  description: string;
  link: string;
}

async function fetchKakaoWebSearch(query: string): Promise<NewsData[]> {
  try {
    // data를 담을 객체
    const arr = [];

    console.log(arr.length);
    // arr안의 data들의 수가 10개가 되면 반환
    // 10개 될때까지 탐색
    let page = 1;
    while (arr.length < 10) {
      const url = `https://dapi.kakao.com/v2/search/web?query=${encodeURIComponent(query)}&size=50&sort=accuracy&page=${page}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'KakaoAK 5a9ad4c0a2958c0a04fd6b04034c47e4', // ← 여기에 발급받은 REST API 키를 입력해야 해
        },
      });

      const data = await response.json();

      const filtered = data.documents.filter(
        (item: any) =>
          item.url.includes('news.daum.net') ||
          item.url.includes('joongang.co.kr') ||
          item.url.includes('yna.co.kr') ||
          item.url.includes('imnews.imbc.com') ||
          item.url.includes('news') ||
          item.url.includes('chosun.com'),
      );
      console.log(Array.isArray(filtered));
      console.log(filtered);
      arr.push(...filtered);
      page = page + 1;
      console.log(arr);
    }

    return arr.map((item: any) => ({
      title: item.title.replace(/<b>/g, '').replace(/<\/b>/g, ''),
      description: item.contents.replace(/<b>/g, '').replace(/<\/b>/g, ''),
      link: item.url,
    }));

    // return data.documents.map((item: any) => ({
    //   title: item.title.replace(/<b>/g, '').replace(/<\/b>/g, ''),
    //   description: item.contents.replace(/<b>/g, '').replace(/<\/b>/g, ''),
    //   link: item.url,
    // }));
  } catch (error) {
    console.error('카카오 API 호출 실패:', error);
    return [];
  }
}

// 슬라이드를 동적으로 추가하는 함수
function updateSwiperSlides(newsData: NewsData[]): void {
  const swiperWrapper = document.querySelector(
    '.swiper-wrapper',
  ) as HTMLElement;
  if (!swiperWrapper) return;

  swiperWrapper.innerHTML = ''; // 기존 슬라이드 제거

  newsData.forEach(news => {
    const slideElement = document.createElement('div');
    slideElement.classList.add('swiper-slide');

    slideElement.innerHTML = `
        <div class="relative bg-blue-500 rounded-2xl p-8 md:p-10 text-left text-white shadow-lg">
          <div class="text-4xl font-serif mb-4">"</div>
          <p class="text-lg md:text-xl mb-6">${news.description}</p>
          <div class="text-gray-200">${news.title}</div>
          <a href="${news.link}" target="_blank" class="mt-3 text-orange-600">Read More</a>
          <div class="h-1 w-full max-w-xs bg-gradient-to-r from-orange-500 to-orange-600 mt-3"></div>
        </div>
      `;
    swiperWrapper.appendChild(slideElement);
  });

  // Swiper 초기화
  //   if ((window as any).swiperInstance) {
  //     (window as any).swiperInstance.update(); // 기존 Swiper 인스턴스 업데이트
  //   } else {
  //     (window as any).swiperInstance = new Swiper('.swiper', {
  //       loop: true,
  //       slidesPerView: 1,
  //       spaceBetween: 10,
  //     });
  //   }
}

// 페이지가 로드되면 데이터를 받아와서 업데이트
window.addEventListener('DOMContentLoaded', async () => {
  const slidesData = await fetchKakaoWebSearch(`이선진`); // ✅ 카카오 API 함수로 변경
  updateSwiperSlides(slidesData);
});
