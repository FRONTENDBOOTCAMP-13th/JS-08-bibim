var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// 뉴스 데이터 타입 정의
// interface NewsData {
//   items: NewsItem[];
// }
// 연합뉴스 피드 가져오기
function getNews() {
    return __awaiter(this, void 0, void 0, function () {
        var URL, response, xmlText, newsItems, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URL = 'http://www.yonhapnewstv.co.kr/category/news/economy/feed/';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(URL)];
                case 2:
                    response = _a.sent();
                    // 성공했는지 확인
                    if (!response.ok) {
                        throw new Error('뉴스를 가져오지 못했습니다');
                    }
                    return [4 /*yield*/, response.text()];
                case 3:
                    xmlText = _a.sent();
                    newsItems = parseRSS(xmlText);
                    console.log(newsItems);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    // 에러 났을 때
                    console.error('에러 발생:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * xml을 json으로 파싱해주는 함수
 * @param xmlText
 * @returns
 */
function parseRSS(xmlText) {
    var items = [];
    // split을 사용한 더 간단한 방법
    var itemSections = xmlText.split('<item>');
    // 첫 번째 요소는 <item> 이전 내용이므로 제외
    for (var i = 1; i < itemSections.length; i++) {
        var itemContent = itemSections[i].split('</item>')[0];
        // 제목 추출
        var titleMatch = itemContent.match(/<title>(.*?)<\/title>/);
        var title = titleMatch
            ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/, '$1')
            : '';
        // 링크 추출
        var linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
        var link = linkMatch ? linkMatch[1] : '';
        if (title && link) {
            items.push({
                title: title,
                description: '', // 간단하게 처리
                link: link,
                pubDate: '',
            });
        }
    }
    return items;
}
getNews();
