import * as functions from 'firebase-functions';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import getUserFromFirestore from '../common/getUserFromFirestore';
/**
 * Firestoreからユーザ情報を取得する
 */
module.exports.getUser = functions.https.onCall(async () => {
  const client = await getGCPAuthorizedClient();
  return await getUserFromFirestore(client).catch(() => {
    return null;
  });
});
