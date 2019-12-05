import * as functions from 'firebase-functions';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import updateUser from '../common/updateUser';
import getUserFromFirestore from '../common/getUserFromFirestore';
import setScheduler from '../common/setScheduler';
/**
 * アラームを設定する
 */
module.exports = functions.https.onCall(async (data, context) => {
  try {
    // OAuthでOAuth2Clientを取得
    const client = await getGCPAuthorizedClient();
    // Firestoreからユーザ情報取得
    const user = await getUserFromFirestore(client);
    // 再生するプレイリストを保存
    await updateUser({
      user,
      client,
      playlistUri: data.playlistUri,
    });
    // 4. cronジョブを設定
    const res = await setScheduler({
      client,
      hour: data.hour,
      minute: data.minute,
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
