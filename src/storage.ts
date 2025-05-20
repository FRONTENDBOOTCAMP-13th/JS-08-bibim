// src/newsCache.ts

const LOCAL_STORAGE_KEY = 'history';

export function saveViewedLink(link: string) {
  const links = getViewedLinks();
  if (!links.includes(link)) {
    links.push(link);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(links));
  }
}

export function getViewedLinks(): string[] {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isViewed(link: string): boolean {
  return getViewedLinks().includes(link);
}
