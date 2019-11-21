import * as functions from 'firebase-functions';
import CONFIG from '../util/CONFIG';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import getNewSpotifyAccessToken from '../common/getNewSpotifyAccessToken';
import getUserPlaylists from '../common/getUserPlaylists';

/**
 * ユーザーのSpotifyプレイリスト一覧を取得する
 */
module.exports = functions.https.onCall(async (data, context) => {
  try {
    const { code, user } = data;
    // OAuthでOAuth2Clientを取得
    const client = await getGCPAuthorizedClient();
    let accessToken = code
      ? await getNewSpotifyAccessToken(client, {
          isRefresh: false,
          code,
        })
      : user.access_token;
    const playlists = await getUserPlaylists(accessToken).catch(async (err) => {
      const regExp = new RegExp(CONFIG.ERROR[401]);
      // AccessTokenがexpiredの場合、新しいAccessTokenを取得する
      if (err.message && regExp.test(err.message)) {
        accessToken = await getNewSpotifyAccessToken(client, {
          isRefresh: true,
          user,
        });
        // リトライ
        return await getUserPlaylists(accessToken);
      } else {
        throw err;
      }
    });
    return {
      ok: true,
      playlists,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
});
