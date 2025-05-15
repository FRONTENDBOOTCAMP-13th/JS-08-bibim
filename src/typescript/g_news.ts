import { getJson } from 'serpapi';

getJson(
  {
    engine: 'google_news',

    gl: 'kr',
    hl: 'ko',
    section_token: 'Economy',
    api_key: '9c751e1e23c75da5a55509e9c1f0d4007d7dfda93193356bf29e4bc0cc2d1ef2',
  },
  json => {
    console.log(json['news_results']);
  },
);
