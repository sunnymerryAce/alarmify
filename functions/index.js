const fetch = require('node-fetch');
const functions = require('firebase-functions');
const { google } = require('googleapis');
const rp = require('request-promise');
const querystring = require('querystring');

const cloudScheduler = google.cloudscheduler('v1beta1');

const projectId = 'alarmify-5f826';
const userName = 'test';
const REDIRECT_URI = 'https://alarmify-5f826.firebaseapp.com/';

/**
 * CloudPlatformのAccessTokenを取得する
 * @returns {string} access_token
 */
const getGCPAccessToken = async () => {
  const scopes = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/cloud-platform',
  ];
  let serviceAccount = require('./Alarmify-service-account-key.json');
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    undefined,
    serviceAccount.private_key,
    scopes,
    undefined,
  );
  try {
    const authorization = await jwtClient.authorize();
    console.log(`GCPアクセストークン取得成功`);
    return authorization.access_token;
  } catch (err) {
    return err;
  }
};

const getSpotifyAccessToken = async (user, isRefresh) => {
  const secretKey = `${user.clientId}:${user.clientSecret}`;
  const buffer = new Buffer(secretKey);
  const base64 = buffer.toString('base64');
  const params = querystring.stringify({
    grant_type: isRefresh ? 'refresh_token' : 'authorization_code',
    code: user.code,
    refresh_token: user.refresh_token,
    redirect_uri: REDIRECT_URI,
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
 * Firestoreからユーザ情報を取得する
 * @param {string} accessToken
 * @returns {object} fields of user
 */
const getUser = async (accessToken) => {
  const endpoint = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default)/documents/users/${userName}`;
  const option = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const res = await rp.get(endpoint, option);
    console.log(`firestoreユーザ情報取得成功`);
    const fields = JSON.parse(res).fields;
    const user = {
      access_token: fields.access_token.stringValue,
      refresh_token: fields.refresh_token.stringValue,
      clientId: fields.clientId.stringValue,
      clientSecret: fields.clientSecret.stringValue,
      playlistUri: fields.playlistUri.stringValue,
    };
    return user;
  } catch (err) {
    console.log(`error occurred  ${err}`);
    return err;
  }
};

/**
 * Firestoreのユーザ情報を更新する
 *
 * @returns {object} fields of document
 */
const updateUser = async ({
  gcpAccessToken,
  user,
  access_token,
  refresh_token,
  playlistUri,
}) => {
  const endpoint = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default)/documents/users/${userName}`;
  const option = {
    method: 'PATCH',
    uri: endpoint,
    headers: {
      Authorization: `Bearer ${gcpAccessToken}`,
    },
    json: true,
    body: {
      name: `projects/${projectId}/databases/(default)/documents/users/${userName}`,
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
        clientId: {
          stringValue: `${user.clientId}`,
        },
        clientSecret: {
          stringValue: `${user.clientSecret}`,
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
  try {
    const res = await rp(option);
    console.log(`firestoreユーザ情報更新成功`);
    return JSON.parse(res).fields;
  } catch (err) {
    console.log(`error occurred  ${err}`);
    return err;
  }
};

exports.getPlaylists = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );

    let res = null;
    try {
      // 1. 既存AccessTokenをFirestoreから取得
      const gcpAccessToken = await getGCPAccessToken();
      const user = await getUser(gcpAccessToken);
      // 2. 既存AccessTokenでトライ
      res = await getList(user.access_token);
      // AccessTokenがexpiredの場合
      if (res.statusCode === 401) {
        // 3. 新しいSpotifyのAccessToken取得
        const newSpotifyAccessToken = await getSpotifyAccessToken(user, true);
        // 4. Firestoreに値を保存
        await updateUser({
          gcpAccessToken: gcpAccessToken,
          user: user,
          access_token: newSpotifyAccessToken.access_token,
          refresh_token: newSpotifyAccessToken.refresh_token,
        });
        // 5. 再トライ
        res = await getList(newSpotifyAccessToken.access_token);
      }
    } catch (error) {
      console.log(`error occurred  ${err}`);
    }
    response.send(res);

    async function getList(accessToken) {
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
    }
  });

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.playSpotify = functions
  .region('asia-northeast1')
  .pubsub.topic('spotify-cron')
  .onPublish(async (message) => {
    let res = null;
    try {
      // 1. 既存AccessTokenをFirestoreから取得
      const gcpAccessToken = await getGCPAccessToken();
      const user = await getUser(gcpAccessToken);
      // 2. 再生を試す
      res = await play(user.access_token, user.playlistUri);
      // AccessTokenがexpiredの場合
      if (res.statusCode === 401) {
        // 3. 新しいSpotifyのAccessToken取得
        const newSpotifyAccessToken = await getSpotifyAccessToken(user, true);
        // 4. Firestoreに値を保存
        await updateUser({
          gcpAccessToken: gcpAccessToken,
          user: user,
          access_token: newSpotifyAccessToken.access_token,
          refresh_token: newSpotifyAccessToken.refresh_token,
        });
        // 5. 再生
        res = await play(newSpotifyAccessToken.access_token, user.playlistUri);
      }
    } catch (error) {
      console.log(`error occurred  ${err}`);
    }

    async function play(accessToken, playlistUri) {
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
    }
  });

exports.scheduleAlarm = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    try {
      // AccessToken取得
      const gcpAccessToken = await getGCPAccessToken();
      // 再生するプレイリストを保存
      const user = await getUser(gcpAccessToken);
      await updateUser({
        gcpAccessToken: gcpAccessToken,
        user: user,
        playlistUri: request.body.playlistUri,
      });
      // タイマーを設定
      const scheduleResult = await setScheduler(gcpAccessToken);
      response.send(scheduleResult);
    } catch (error) {
      console.log(`error occurred  ${err}`);
    }

    async function setScheduler(accessToken) {
      const projectId = 'alarmify-5f826';
      const location = 'us-central1';
      const job = 'spotify-cron';
      const endpoint = `https://cloudscheduler.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/jobs/${job}`;
      const option = {
        method: 'PATCH',
        uri: endpoint,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        qs: {
          updateMask: 'schedule',
        },
        json: true,
        body: {
          // 分 時 日 月 曜日
          schedule: `${request.body.minute} ${request.body.hour} * * 1-5`,
        },
      };
      try {
        const res = await rp(option);
        console.log(`Cloud Scheduler設定完了`);
        return res;
      } catch (err) {
        console.log(`error occurred  ${err}`);
        return err;
      }
    }
  });

exports.scheduleAlarm2 = functions
  .region('asia-northeast1')
  .https.onRequest(async (request, response) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );

    const client = await google.auth.getClient({
      scopes: [
        'https://www.googleapis.com/auth/datastore',
        'https://www.googleapis.com/auth/cloud-platform',
      ],
    });
    const projectId = 'alarmify-5f826';
    const location = 'us-central1';
    const job = 'spotify-cron';

    const requestForCloudScheduler = {
      parent: `projects/${projectId}/locations/${location}/jobs/${job}`,
      resource: {
        // 分 時 日 月 曜日
        schedule: `5 7 * * 1-5`,
      },
      auth: client,
    };

    cloudScheduler.projects.locations.jobs.patch(
      requestForCloudScheduler,
      (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(JSON.stringify(response, null, 2));
      },
    );
  });
