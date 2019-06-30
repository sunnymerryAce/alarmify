const rp = require('request-promise');
const querystring = require('querystring');
const { google } = require('googleapis');
const cloudScheduler = google.cloudscheduler('v1beta1');
const firestore = google.firestore('v1beta1');

const { CONFIG } = require('./CONFIG');
const projectId = CONFIG.PROJECT_ID;
const databaseId = CONFIG.DATABASE_ID;
const locationId = CONFIG.LOCATION_ID;
const jobName = CONFIG.JOB_NAME;
// TODO: ユーザーの新規登録を可能にする
const userName = CONFIG.USER_NAME;
const redirectUri = CONFIG.REDIRECT_URI;

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
const getUser = (client) => {
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
        code: {
          stringValue: `${user.code}`,
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
  const buffer = new Buffer(secretKey);
  const base64 = buffer.toString('base64');
  const params = querystring.stringify({
    grant_type: isRefresh ? 'refresh_token' : 'authorization_code',
    code: user.code,
    refresh_token: user.refresh_token,
    redirect_uri: redirectUri,
  });
  const options = {
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64}`,
    },
    body: params,
  };
  try {
    const res = await rp(options);
    console.log(' SpotifyのAccessToken再度取得成功');
    return JSON.parse(res);
  } catch (err) {
    console.log(`error occurred  ${err}`);
    return err;
  }
};

/**
 * ユーザのプレイリスト一覧を取得する(Spotify APIリクエスト)
 * @param {String} accessToken
 * @returns {Array} playlists
 */
const getPlaylists = async (accessToken) => {
  const options = {
    method: 'GET',
    uri: 'https://api.spotify.com/v1/me',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await rp(options);
    const info = JSON.parse(res);
    // プレイリストを取得
    const listOptions = {
      method: 'GET',
      uri: `https://api.spotify.com/v1/users/${info.id}/playlists`,
      qs: {
        limit: 50,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    return await rp(listOptions);
  } catch (err) {
    console.log(`error occurred  ${err}`);
    return err;
  }
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
  console.log(`projects/${projectId}/topics/${jobName}`);
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
    // TODO: 初回はジョブ作成にする
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
module.exports.getPlaylists = getPlaylists;
module.exports.setScheduler = setScheduler;
module.exports.playSpotify = playSpotify;
