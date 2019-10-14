import * as functions from 'firebase-functions';
import CONFIG from '../util/CONFIG';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import updateUser from '../common/updateUser';
import getSpotifyAccessToken from '../common/getSpotifyAccessToken';
import playSpotify from '../common/playSpotify';
import getUserFromFirestore from '../common/getUserFromFirestore';

/**
 * 接続されたデバイスでSpotifyを再生する
 */
module.exports.playSpotify = functions
  .region('asia-northeast1')
  .pubsub.topic(CONFIG.JOB_NAME)
  .onPublish(async message => {
    let res = null;
    // 1. OAuthでOAuth2Clientを取得
    const client = await getGCPAuthorizedClient();
    // 2.ユーザ情報取得 from Firestore
    const user = await getUserFromFirestore(client);
    // 3. 再生を試す
    res = await playSpotify({
      accessToken: user.access_token,
      playlistUri: user.playlistUri,
      deviceId: user.deviceId ? user.deviceId : '',
    }).catch(async err => {
      // AccessTokenがexpiredの場合
      const regExp = new RegExp(CONFIG.ERROR[401]);
      if (err.message && regExp.test(err.message)) {
        // 4. 新しいSpotifyのAccessToken取得
        const { access_token, refresh_token } = await getSpotifyAccessToken(
          user,
          true,
        );
        // 5. Firestoreに値を保存
        await updateUser({
          user,
          client,
          access_token: access_token,
          refresh_token: refresh_token,
        });
        // 再トライ
        return await playSpotify({
          accessToken: access_token,
          playlistUri: user.playlistUri,
          deviceId: user.deviceId ? user.deviceId : '',
        });
      }
    });
    return res;
  });
