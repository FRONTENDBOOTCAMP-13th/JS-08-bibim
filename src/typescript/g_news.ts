import { getJson } from 'serpapi';

getJson(
  {
    engine: 'google_news',

    gl: 'kr',
    hl: 'ko',
    section_token: 'Economy',
    api_key: `${import.meta.env.VITE_GOOGLE_NEWS_API_KEY}`,
  },
  json => {
    console.log(json['news_results']);
  },
);
