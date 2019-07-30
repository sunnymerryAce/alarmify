const rp = require('request-promise');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { google } = require('googleapis');
const cloudScheduler = google.cloudscheduler('v1beta1');
const firestore = google.firestore('v1beta1');
const { CONFIG } = require('./CONFIG');
const projectId = CONFIG.PROJECT_ID;
const databaseId = CONFIG.DATABASE_ID;
const locationId = CONFIG.LOCATION_ID;
const jobName = CONFIG.JOB_NAME;
const userName = CONFIG.USER_NAME;
const redirectUri = CONFIG.REDIRECT_URI;

/**
 * Create URLSearchParams Instance from Object
 * @param {Object} params
 * @returns {URLSearchParams}
 */
const getURLSearchParams = params => {
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
 * @returns {Object}
 * @throws {Error}
 */
const fetchWithErrorHandling = ({ url, options }) => {
  const handleErrors = res => {
    if (res.ok) {
      return res;
    }
    switch (res.status) {
      case 400:
        throw new Error(CONFIG.ERROR[400]);
      case 401:
        throw new Error(CONFIG.ERROR[401]);
      case 403:
        throw new Error(CONFIG.ERROR[403]);
      case 404:
        throw new Error(CONFIG.ERROR[404]);
      case 500:
        throw new Error(CONFIG.ERROR[500]);
      case 502:
        throw new Error(CONFIG.ERROR[502]);
      default:
        throw new Error(CONFIG.ERROR.default);
    }
  };
  // fetchの結果を非同期で返す
  return (
    fetch(url, options)
      // サーバサイドで発行されたエラーステータスを処理する
      .then(handleErrors)
      // 正常なレスポンスからJSONオブジェクトをパースする
      .then(response => response.json())
      .then(data => {
        return data;
      })
      // ネットワーク周りなどのリクエスト以前の段階でのエラーを処理する
      .catch(err => {
        throw new Error(err);
      })
  );
};

/**
 * GCPのOAuth認証を行い、クライアント認証情報を取得する
 * @returns {OAuth2Client} client
 */
const getGCPAuthorizedClient = async () => {
  const scopes = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/cloud-platform',
  ];
  client = await google.auth.getClient({
    scopes,
  });
  return client;
};

/**
 * Firestoreからユーザ情報を取得する
 * @param {OAuth2Client} client
 * @returns {Object} user information
 */
const getUser = client => {
  const documentPath = `users/${userName}`;
  const params = {
    auth: client,
    name: `projects/${projectId}/databases/${databaseId}/documents/${documentPath}`,
  };
  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.get(params, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const user = {
          access_token: response.data.fields.access_token.stringValue,
          refresh_token: response.data.fields.refresh_token.stringValue,
          playlistUri: response.data.fields.playlistUri.stringValue,
        };
        resolve(user);
      }
    });
  });
};

/**
 * Firestoreのユーザ情報を更新する
 * @param {Object} params
 * @param {Object} params.user user information
 * @param {OAuth2Client} params.client
 * @param {String} params.access_token
 * @param {String} params.refresh_token
 * @param {String} params.playlistUri
 * @returns {Object} fields of document
 */
const updateUser = ({
  user,
  client,
  access_token,
  refresh_token,
  playlistUri,
}) => {
  const documentPath = `users/${userName}`;
  const params = {
    auth: client,
    name: `projects/${projectId}/databases/${databaseId}/documents/${documentPath}`,
    requestBody: {
      fields: {
        access_token: {
          stringValue: access_token
            ? `${access_token}`
            : `${user.access_token}`,
        },
        refresh_token: {
          stringValue: refresh_token
            ? `${refresh_token}`
            : `${user.refresh_token}`,
        },
        playlistUri: {
          stringValue: playlistUri ? `${playlistUri}` : `${user.playlistUri}`,
        },
      },
    },
  };
  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.patch(params, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(response.data.fields);
      }
    });
  });
};

/**
 * Spotify APIのアクセストークンを取得する
 * @param {Object} user ユーザ情報
 * @param {Boolean} isRefresh リフレッシュトークンを使った再取得かどうか
 */
const getSpotifyAccessToken = async (user, isRefresh) => {
  const secretKey = `${CONFIG.SPOTIFY_CLIENT_ID}:${
    CONFIG.SPOTIFY_CLIENT_SECRET
  }`;
  const buffer = Buffer.from(secretKey);
  const base64 = buffer.toString('base64');
  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64}`,
    },
    body: getURLSearchParams({
      grant_type: isRefresh ? 'refresh_token' : 'authorization_code',
      code: isRefresh ? '' : user.code,
      redirect_uri: isRefresh ? '' : redirectUri,
      refresh_token: isRefresh ? user.refresh_token : '',
    }),
  };
  try {
    const response = await fetch(CONFIG.SPOTIFY_API.GET_TOKEN, params);
    return await response.json();
  } catch (err) {
    console.log(`error occurred  ${err}`);
    return err;
  }
};

/**
 * ユーザのプレイリスト一覧を取得する(SpotifyAPIリクエスト)
 * @param {String} accessToken
 * @returns {Object}
 * @throws {Error}
 */
const getUserPlaylists = async accessToken => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  // Spotifyユーザ情報を取得
  const userInfo = await fetchWithErrorHandling({
    url: CONFIG.SPOTIFY_API.GET_USER_INFO,
    options,
  });

  // プレイリストを取得
  const query = getURLSearchParams({ limit: 50 });
  const url = `${CONFIG.SPOTIFY_API.GET_PLAYLIST(
    userInfo.id,
  )}?${query.toString()}`;
  playlistInfo = await fetchWithErrorHandling({ url, options });
  return playlistInfo;
};

/**
 * Cloud Schedulerにジョブを設定する(update)
 * @param {Object} params
 * @param {OAuth2Client} params.client
 * @param {Number} params.hour
 * @param {Number} params.minute
 */
const setScheduler = ({ client, hour, minute }) => {
  const schedule = `${minute} ${hour} * * *`;
  const params = {
    name: `projects/${projectId}/locations/${locationId}/jobs/${jobName}`,
    updateMask: 'schedule',
    resource: {
      schedule,
      pubsubTarget: {
        topicName: `projects/${projectId}/topics/${jobName}`,
      },
    },
    auth: client,
  };
  return new Promise((resolve, reject) => {
    cloudScheduler.projects.locations.jobs.patch(params, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(`Cloud Scheduler設定完了`);
        resolve(response.data);
      }
    });
  });
};

/**
 * 接続先デバイスから音楽を再生する(Spotify APIリクエスト)
 * @param {string} accessToken
 * @param {string} playlistUri
 */
const playSpotify = async (accessToken, playlistUri) => {
  const bodyObject = {
    context_uri: playlistUri,
  };
  const options = {
    method: 'PUT',
    uri: 'https://api.spotify.com/v1/me/player/play',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bodyObject),
  };
  try {
    const res = await rp(options);
    return res;
  } catch (err) {
    console.log(`error occurred  ${err}`);
    return err;
  }
};

module.exports.getGCPAuthorizedClient = getGCPAuthorizedClient;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.getSpotifyAccessToken = getSpotifyAccessToken;
module.exports.getUserPlaylists = getUserPlaylists;
module.exports.setScheduler = setScheduler;
module.exports.playSpotify = playSpotify;
