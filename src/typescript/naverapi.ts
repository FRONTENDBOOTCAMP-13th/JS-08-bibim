const clientId = '2ODTy1eCXan80pD_dB3d';
const clientSecret = 'DMBwFd0_Ed';
const keyword = '롯데 자이언츠';

async function NaverNews() {
  const URL = `https://openapi.naver.com/v1/search/news.json?query=${keyword}&display=10&start=1&sort=sim`;

  fetch(URL, {
    method: 'GET',
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

NaverNews();
