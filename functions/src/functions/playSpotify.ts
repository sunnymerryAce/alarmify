import * as functions from 'firebase-functions';
import CONFIG from '../util/CONFIG';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import getNewSpotifyAccessToken from '../common/getNewSpotifyAccessToken';
import playSpotify from '../common/playSpotify';
import getUserFromFirestore from '../common/getUserFromFirestore';

/**
 * 接続されたデバイスでSpotifyを再生する
 */
module.exports = functions
  .region('asia-northeast1')
  .pubsub.topic(CONFIG.JOB_NAME)
  .onPublish(async () => {
    try {
      let res = null;
      // 1. OAuthでOAuth2Clientを取得
      const client = await getGCPAuthorizedClient();
      // 2.ユーザ情報取得 from Firestore
      const user = await getUserFromFirestore(client);
      // 3. 再生を試す
      res = await playSpotify({
        accessToken: user.access_token,
        playlistUri: user.playlistUri,
        deviceId: user.deviceId || '',
      }).catch(async (error) => {
        // AccessTokenがexpiredの場合、新しいAccessTokenを取得する
        if (error.message && CONFIG.REG_EXP.ERROR[401].test(error.message)) {
          const accessToken = await getNewSpotifyAccessToken(client, {
            isRefresh: true,
            refresh_token: user.refresh_token,
          });
          // 再トライ
          return await playSpotify({
            accessToken: accessToken,
            playlistUri: user.playlistUri,
            deviceId: user.deviceId || '',
          });
        }
      });
      return {
        ok: true,
        res,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  });
