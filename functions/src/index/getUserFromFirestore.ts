import * as functions from 'firebase-functions';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import getUser from '../common/getUser';

/**
 * Firestoreからユーザ情報を取得する
 */
module.exports.getUserFromFirestore = functions.https.onCall(
  async (data, context) => {
    const client = await getGCPAuthorizedClient();
    return await getUser(client).catch(() => {
      return null;
    });
  },
);
