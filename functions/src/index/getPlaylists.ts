import * as functions from 'firebase-functions';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import getUser from '../common/getUser';
import updateUser from '../common/updateUser';

/**
 * ユーザーのSpotifyプレイリスト一覧を取得する
 */
module.exports.getPlaylists = functions.https.onCall(async (data, context) => {
  let res = null;
  // OAuthでOAuth2Clientを取得
  const client = await getGCPAuthorizedClient();
  // AuthorizationCodeがある場合
  if (data.code) {
    const newUser = {
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
