// Swiper 모듈 import
// Swiper Init
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

window.addEventListener("DOMContentLoaded", () => {
  new Swiper(".mySwiper", {
    modules: [EffectCards],
    effect: "cards",
    grabCursor: true,
  });
});

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
        method: "GET",
        headers: {
          Authorization: "KakaoAK 5a9ad4c0a2958c0a04fd6b04034c47e4", // ← 여기에 발급받은 REST API 키를 입력해야 해
        },
      });

      const data = await response.json();

      const filtered = data.documents.filter(
        (item: any) =>
          item.url.includes("news.daum.net") ||
          item.url.includes("joongang.co.kr") ||
          item.url.includes("yna.co.kr") ||
          item.url.includes("imnews.imbc.com") ||
          item.url.includes("news") ||
          item.url.includes("chosun.com"),
      );
      console.log(Array.isArray(filtered));
      console.log(filtered);
      arr.push(...filtered);
      page = page + 1;
      console.log(arr);
    }

    return arr.map((item: any) => ({
      title: item.title.replace(/<b>/g, "").replace(/<\/b>/g, ""),
      description: item.contents.replace(/<b>/g, "").replace(/<\/b>/g, ""),
      link: item.url,
    }));

    // return data.documents.map((item: any) => ({
    //   title: item.title.replace(/<b>/g, '').replace(/<\/b>/g, ''),
    //   description: item.contents.replace(/<b>/g, '').replace(/<\/b>/g, ''),
    //   link: item.url,
    // }));
  } catch (error) {
    console.error("카카오 API 호출 실패:", error);
    return [];
  }
}

// 슬라이드를 동적으로 추가하는 함수
function updateSwiperSlides(newsData: NewsData[], query: string): void {
  const swiperWrapper = document.querySelector(
    ".swiper-wrapper",
  ) as HTMLElement;
  if (!swiperWrapper) return;

  swiperWrapper.innerHTML = ""; // 기존 슬라이드 제거

  // 배경색 배열 정의 (Tailwind 색상 클래스)
  const bgColors = [
    "bg-blue-500",
    "bg-indigo-700",
    "bg-blue-800",
    "bg-sky-900",
  ];

  newsData.forEach((news, index) => {
    const slideElement = document.createElement("div");
    slideElement.classList.add("swiper-slide");

    // 인덱스를 색상 배열 크기로 나눠서 반복 순환
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

  // Swiper 초기화
  if ((window as any).swiperInstance) {
    (window as any).swiperInstance.update(); // 기존 Swiper 인스턴스 업데이트
  } else {
    (window as any).swiperInstance = new Swiper(".myswiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
    });
  }
}

// 페이지가 로드되면 데이터를 받아와서 업데이트
window.addEventListener("DOMContentLoaded", async () => {
  const query = "경제"; // 검색어를 여기에 입력하세요
  const slidesData = await fetchKakaoWebSearch(query); // ✅ 카카오 API 함수로 변경
  updateSwiperSlides(slidesData, query);
});
