import * as functions from 'firebase-functions';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import updateUser from '../common/updateUser';
import getUserFromFirestore from '../common/getUserFromFirestore';
import setScheduler from '../common/setScheduler';
/**
 * アラームを設定する
 */
module.exports.scheduleAlarm = functions.https.onCall(async (data, context) => {
  try {
    // 1. OAuthでOAuth2Clientを取得
    const client = await getGCPAuthorizedClient();
    // 2. ユーザ情報取得 from Firestore
    const user = await getUserFromFirestore(client);
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
