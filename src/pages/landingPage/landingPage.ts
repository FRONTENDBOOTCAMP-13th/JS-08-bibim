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

// 슬라이드 데이터 타입 정의
// 뉴스 데이터 타입 정의
// interface NewsData {
//   title: string;
//   description: string;
//   link: string;
// }

// // API 호출 함수 (네이버 뉴스 API 사용)
// async function fetchSlidesData(query: string): Promise<NewsData[]> {
//   try {
//     const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=3&start=1&sort=sim`;
//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         "X-Naver-Client-Id": "", // 네이버 개발자 센터에서 발급받은 Client ID
//         "X-Naver-Client-Secret": "", // 네이버 개발자 센터에서 발급받은 Client Secret
//       },
//     });
//     const data = await response.json();
//     return data.items.map((item: any) => ({
//       title: item.title.replace(/<b>/g, "").replace(/<\/b>/g, ""), // <b> 태그 제거
//       description: item.description.replace(/<b>/g, "").replace(/<\/b>/g, ""), // <b> 태그 제거
//       link: item.link,
//     }));
//   } catch (error) {
//     console.error("API 호출 실패:", error);
//     return [];
//   }
// }

// // 슬라이드를 동적으로 추가하는 함수
// function updateSwiperSlides(newsData: NewsData[]): void {
//   const swiperWrapper = document.querySelector(
//     ".swiper-wrapper",
//   ) as HTMLElement;
//   if (!swiperWrapper) return;

//   swiperWrapper.innerHTML = ""; // 기존 슬라이드 제거

//   newsData.forEach((news) => {
//     const slideElement = document.createElement("div");
//     slideElement.classList.add("swiper-slide");

//     slideElement.innerHTML = `
//       <div class="relative bg-blue-500 rounded-2xl p-8 md:p-10 text-left text-white shadow-lg">
//         <div class="text-4xl font-serif mb-4">"</div>
//         <p class="text-lg md:text-xl mb-6">${news.description}</p>
//         <div class="text-gray-200">${news.title}</div>
//         <a href="${news.link}" target="_blank" class="mt-3 text-orange-600">Read More</a>
//         <div class="h-1 w-full max-w-xs bg-gradient-to-r from-orange-500 to-orange-600 mt-3"></div>
//       </div>
//     `;
//     swiperWrapper.appendChild(slideElement);
//   });

//   // Swiper 초기화
//   if ((window as any).swiperInstance) {
//     (window as any).swiperInstance.update(); // 기존 Swiper 인스턴스 업데이트
//   } else {
//     (window as any).swiperInstance = new Swiper(".swiper", {
//       loop: true,
//       slidesPerView: 1,
//       spaceBetween: 10,
//     });
//   }
// }

// // 페이지가 로드되면 데이터를 받아와서 업데이트
// window.addEventListener("DOMContentLoaded", async () => {
//   const slidesData = await fetchSlidesData("주식");
//   updateSwiperSlides(slidesData);
// });

// /// kakao API로 변경

// interface NewsData {
//   title: string;
//   description: string;
//   link: string;
// }

// async function fetchKakaoWebSearch(query: string): Promise<NewsData[]> {
//   try {
//     const url = `https://dapi.kakao.com/v2/search/web?query=${encodeURIComponent(query)}&size=3&sort=accuracy`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: "KakaoAK (여기에 키 입력)", // ← 여기에 발급받은 REST API 키를 입력해야 해
//       },
//     });

//     const data = await response.json();

//     return data.documents.map((item: any) => ({
//       title: item.title.replace(/<b>/g, "").replace(/<\/b>/g, ""),
//       description: item.contents.replace(/<b>/g, "").replace(/<\/b>/g, ""),
//       link: item.url,
//     }));
//   } catch (error) {
//     console.error("카카오 API 호출 실패:", error);
//     return [];
//   }
// }

// // 슬라이드를 동적으로 추가하는 함수
// function updateSwiperSlides(newsData: NewsData[]): void {
//   const swiperWrapper = document.querySelector(
//     ".swiper-wrapper",
//   ) as HTMLElement;
//   if (!swiperWrapper) return;

//   swiperWrapper.innerHTML = ""; // 기존 슬라이드 제거

//   newsData.forEach((news) => {
//     const slideElement = document.createElement("div");
//     slideElement.classList.add("swiper-slide");

//     slideElement.innerHTML = `
//       <div class="relative bg-blue-500 rounded-2xl p-8 md:p-10 text-left text-white shadow-lg">
//         <div class="text-4xl font-serif mb-4">"</div>
//         <p class="text-lg md:text-xl mb-6">${news.description}</p>
//         <div class="text-gray-200">${news.title}</div>
//         <a href="${news.link}" target="_blank" class="mt-3 text-orange-600">Read More</a>
//         <div class="h-1 w-full max-w-xs bg-gradient-to-r from-orange-500 to-orange-600 mt-3"></div>
//       </div>
//     `;
//     swiperWrapper.appendChild(slideElement);
//   });

//   // Swiper 초기화
//   if ((window as any).swiperInstance) {
//     (window as any).swiperInstance.update(); // 기존 Swiper 인스턴스 업데이트
//   } else {
//     (window as any).swiperInstance = new Swiper(".swiper", {
//       loop: true,
//       slidesPerView: 1,
//       spaceBetween: 10,
//     });
//   }
// }

// // 페이지가 로드되면 데이터를 받아와서 업데이트
// window.addEventListener("DOMContentLoaded", async () => {
//   const slidesData = await fetchKakaoWebSearch(`"주식" "조선일보"`); // ✅ 카카오 API 함수로 변경
//   updateSwiperSlides(slidesData);
// });
