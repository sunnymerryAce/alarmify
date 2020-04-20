import * as functions from 'firebase-functions';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import getUserFromFirestore from '../common/getUserFromFirestore';

import User from 'user';
/**
 * Firestoreからユーザ情報を取得する
 */
module.exports = functions.https.onCall(async () => {
  try {
    const client = await getGCPAuthorizedClient();
    const user: User = await getUserFromFirestore(client);
    return {
      ok: true,
      user,
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
});
