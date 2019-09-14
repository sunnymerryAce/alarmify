import * as functions from 'firebase-functions';
import getGCPAuthorizedClient from '../common/getGCPAuthorizedClient';
import getUser from '../common/getUserFromFirestore';
import { JWT, Compute, UserRefreshClient } from 'google-auth-library';
/**
 * Firestoreからユーザ情報を取得する
 */
module.exports.getUserFromFirestore = functions.https.onCall(async () => {
  const client:
    | JWT
    | Compute
    | UserRefreshClient = await getGCPAuthorizedClient();
  return await getUser(client).catch(() => {
    return null;
  });
});
