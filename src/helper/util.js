/**
 * イベントをキャンセルする
 * @param {EventTarget} e
 * @returns {void}
 */
export const cancelEvent = (e) => {
  e.preventDefault();
};

/**
 * スクロールを固定/固定解除する
 * @param {boolean} fix 固定はtrue、解除はfalse
 * @returns {void}
 */
export const toggleScroll = ({ fix }) => {
  // IEにWheelEventないので要判定
  const wheelEvent = window.WheelEvent ? 'wheel' : 'mousewheel';
  if (fix) {
    // optionを全く同じにしないとIEでremoveされない
    document.addEventListener(wheelEvent, cancelEvent, { passive: false });
    document.addEventListener('touchmove', cancelEvent, { passive: false });
  } else {
    document.removeEventListener(wheelEvent, cancelEvent, { passive: false });
    document.removeEventListener('touchmove', cancelEvent, { passive: false });
  }
};

/**
 * RequestAnimationFrameを初期化し、現在日時を取得する
 * @returns {number} ミリ秒単位で計測された DOMHighResTimeStamp
 */
export const getTimeForRequestAnimationFrame = () => {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  const cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.mozcancelAnimationFrame ||
    window.webkitcancelAnimationFrame ||
    window.mscancelAnimationFrame;
  window.cancelAnimationFrame = cancelAnimationFrame;

  const now =
    window.performance &&
    (performance.now ||
      performance.mozNow ||
      performance.msNow ||
      performance.oNow ||
      performance.webkitNow);

  return now ? now.call(performance) : new Date().getTime();
};

/**
 * 英数字をspanタグで囲む
 * @param {Object} params
 * @param {string} params.string
 * @param {string} params.className spanタグのクラス名
 * @returns {string}
 */
export const wrapAlphanumericWithSpan = ({ string, className = '' }) => {
  if (string === null || string === undefined) {
    throw new Error('String is invalid.');
  } else {
    return string.replace(
      /([a-zA-Z0-9,¥.-]+)/g,
      `<span class="${className}">$1</span>`,
    );
  }
};

/**
 * 乱数取得
 * min から max までの乱整数を返す関数 min、maxは順不同
 * Math.round() を用いると非一様分布
 * @param {Object} params
 * @param {number} params.min
 * @param {number} params.max
 * @returns {number}
 */
export const randomIntegerInRange = ({ min = 0, max = 0 }) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * 範囲内判定
 * Checks if the given number falls within the given range.
 * @param {Object} params
 * @param {number} params.number
 * @param {number} params.first
 * @param {number} params.last
 */
export const isInRange = ({ number = null, first = null, last = null }) => {
  if (typeof number !== 'number') throw new Error('No number.');
  if (typeof first !== 'number' && typeof last !== 'number')
    throw new Error('No range.');
  // upper limit only
  if (typeof first !== 'number') return number <= last;
  // lower limit only
  if (typeof last !== 'number') return number >= first;
  return number >= first && number <= last;
};

/**
 * 確率に対応する配列要素を返す
 * @param {Object} params
 * @param {array} params.odds 確率 (0~100)
 * @param {array} params.results
 * @returns {any}
 * @throws {Error}
 */
export const getIndexValueOfGivenPercentage = ({ odds, results }) => {
  // 確率と返す結果が同じ長さ出ない場合、エラ＝
  if (odds.length !== results.length) {
    throw new Error('Lengths are not equal.');
  }
  const incrementor = (accumulator, currentValue) => accumulator + currentValue;
  // 確率の合計が100でない場合、エラー
  if (odds.reduce(incrementor) !== 100) {
    throw new Error('Total odds must be 100.');
  }

  // 計算用配列を作成
  const calcOdds = odds.map((percentage, index) => {
    const res = odds.concat().splice(index, odds.length);
    return res.reduce(incrementor);
  });

  // 乱数作成
  const number = randomIntegerInRange({ min: 1, max: 100 });
  let result = '';
  calcOdds.forEach((percentage, index) => {
    // 確率の範囲内であればインデックスを更新
    if (number <= percentage) result = results[index];
  });
  return result;
};

/**
 * Get Width with Margin
 * @param {Element} $el
 * @returns {number}
 */
export const getOuterWidth = ($el) => {
  const style = getComputedStyle($el);
  let width = $el.offsetWidth;
  width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
  return width;
};

/**
 * passive:trueが使えるかどうかを判定する
 * @returns {boolean}
 */
export const enablePassiveEventListeners = () => {
  let result = false;

  const opts =
    Object.defineProperty &&
    Object.defineProperty({}, 'passive', {
      get: () => {
        result = true;
      },
    });
  document.addEventListener('test', () => {}, opts);

  return result;
};

/**
 * get QueryParameters As Object
 * @returns {Object} QueryParameters
 */
export const getQueryObject = () => {
  const object = {};
  const arrQueries = window.location.search.replace(/^\?/, '').split('&');
  arrQueries.forEach((query) => {
    const key = query.split('=')[0];
    const value = query.split('=')[1];
    object[key] = value;
  });
  return object;
};

/**
 * Copy string to clipboard
 * @param {string} string
 * @returns {boolean} result
 */
export const copyToClipboard = (string) => {
  const $el = document.createElement('textarea');
  $el.textContent = string;
  const $body = document.querySelector('body');
  $body.appendChild($el);
  $el.select();
  const result = document.execCommand('copy');
  $body.removeChild($el);
  return result;
};

/**
 * Create URLSearchParams Instance from Object
 * @param {Object} params
 * @returns {URLSearchParams}
 */
export const getURLSearchParams = (params) => {
  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlSearchParams.append(key, value);
  });
  return urlSearchParams;
};

/**
 * Fetch HTTP request with handling server errors
 * @param {Object} params
 * @param {string} param.url
 * @param {Object} param.options
 * @returns {Object} Result
 * @throws {Error} Server or other error
 */
export const fetchWithErrorHandling = ({ url, options }) => {
  const handleErrors = (res) => {
    if (res.ok) {
      return res;
    }
    switch (res.status) {
      case 400:
        throw new Error('BAD_REQUEST');
      case 401:
        throw new Error('UNAUTHORIZED');
      case 403:
        throw new Error('FORBIDDEN');
      case 404:
        throw new Error('NOT_FOUND');
      case 500:
        throw new Error('INTERNAL_SERVER_ERROR');
      case 502:
        throw new Error('BAD_GATEWAY');
      default:
        throw new Error('UNHANDLED_ERROR');
    }
  };

  fetch(url, options)
    // ネットワーク周りなどのリクエスト以前の段階でのエラーを処理する
    .catch((e) => {
      throw new Error(e);
    })
    // サーバサイドで発行されたエラーステータスを処理する
    .then(handleErrors)
    // 以上2つをパスした正常なレスポンスからJSONオブジェクトをパースする
    .then((res) => res.json());
};
