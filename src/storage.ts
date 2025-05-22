const LOCAL_STORAGE_KEY = 'history';

export interface NewsData {
  link: string;
  title: string;
  description: string;
  originallink: string;
  pubDate: string; // ISO 문자열 (날짜)
  keyword?: string; // 검색어
}

export function saveViewedNews(news: NewsData) {
  const existing = getViewedNews();

  // 중복 방지
  const alreadyExists = existing.some(item => item.link === news.link);
  if (!alreadyExists) {
    existing.push(news);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  }
}

export function getViewedNews(): NewsData[] {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isViewed(link: string): boolean {
  return getViewedNews().some(item => item.link === link);
}
