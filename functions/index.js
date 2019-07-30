const functions = require('firebase-functions');
const { CONFIG } = require('./common/CONFIG');
const {
  getGCPAuthorizedClient,
  getUser,
  updateUser,
  getSpotifyAccessToken,
  getUserPlaylists,
  setScheduler,
  playSpotify,
} = require('./common/common');

/**
 * Firestoreのユーザ情報を取得する
 */
exports.getFirestoreUser = functions.https.onCall(async (data, context) => {
  const client = await getGCPAuthorizedClient();
  return await getUser(client).catch(() => {
    return null;
  });
});

/**
 * ユーザーのSpotifyプレイリスト一覧を取得する
 */
exports.getPlaylists = functions.https.onCall(async (data, context) => {
  let res = null;
  // OAuthでOAuth2Clientを取得
  const client = await getGCPAuthorizedClient();
  // AuthorizationCodeがある場合
  if (data.code) {
    newUser = {
      access_token: '',
      playlistUri: '',
      code: data.code,
      refresh_token: '',
    };
    // 新しいSpotifyのAccessToken取得
    const newSpotifyAccessToken = await getSpotifyAccessToken(newUser, false);
    // Firestoreに値を保存
    await updateUser({
      user: newUser,
      client,
      access_token: newSpotifyAccessToken.access_token,
      refresh_token: newSpotifyAccessToken.refresh_token,
    });
    res = await getUserPlaylists(newSpotifyAccessToken.access_token);
  } else if (data.user) {
    // 既存AccessTokenでトライ
    res = await getUserPlaylists(data.user.access_token).catch(async err => {
      // AccessTokenがexpiredの場合
      const regExp = new RegExp(CONFIG.ERROR[401]);
      if (err.message && regExp.test(err.message)) {
        // 新しいSpotifyのAccessToken取得
        const newSpotifyAccessToken = await getSpotifyAccessToken(
          data.user,
          true,
        );
        // Firestoreに値を保存
        await updateUser({
          user: data.user,
          client,
          access_token: newSpotifyAccessToken.access_token,
          refresh_token: newSpotifyAccessToken.refresh_token,
        });
        // 再トライ
        return await getUserPlaylists(newSpotifyAccessToken.access_token);
      }
    });
  }
  return res;
});

/**
 * アラームを設定する
 */
exports.scheduleAlarm = functions.https.onCall(async (data, context) => {
  try {
    // 1. OAuthでOAuth2Clientを取得
    const client = await getGCPAuthorizedClient();
    // 2. ユーザ情報取得 from Firestore
    const user = await getUser(client);
    // 3. 再生するプレイリストを保存
    await updateUser({
      user: user,
      playlistUri: data.playlistUri,
    });
    // 4. cronジョブを設定
    return await setScheduler({
      client,
      hour: data.hour,
      minute: data.minute,
    });
  } catch (error) {
    console.log(`error occurred  ${error}`);
  }
});

/**
 * 接続されたデバイスでSpotifyを再生する
 */
exports.playSpotify = functions
  .region('asia-northeast1')
  .pubsub.topic(CONFIG.JOB_NAME)
  .onPublish(async message => {
    let res = null;
    try {
      // 1. OAuthでOAuth2Clientを取得
      const client = await getGCPAuthorizedClient();
      // 2.ユーザ情報取得 from Firestore
      const user = await getUser(client);
      // 3. 再生を試す
      res = await playSpotify(
        user.access_token,
        user.playlistUri,
        user.deviceId,
      );
      // AccessTokenがexpiredの場合
      if (res.status === 401) {
        // 4. 新しいSpotifyのAccessToken取得
        const newSpotifyAccessToken = await getSpotifyAccessToken(user, true);
        // 5. Firestoreに値を保存
        await updateUser({
          user: user,
          access_token: newSpotifyAccessToken.access_token,
          refresh_token: newSpotifyAccessToken.refresh_token,
        });
        // 6. 再生
        res = await playSpotify(
          newSpotifyAccessToken.access_token,
          user.playlistUri,
          user.deviceId,
        );
      }
    } catch (error) {
      console.log(`error occurred  ${err}`);
    }
  });
