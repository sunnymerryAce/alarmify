// import { JWT, Compute, UserRefreshClient } from 'google-auth-library';
import { User } from '../../../types';
import CONFIG from '../util/CONFIG';
import { google } from 'googleapis';
const firestore = google.firestore('v1beta1');
/**
 * Firestoreからユーザ情報を取得する
 * @param client
 * @returns user information
 */
const getUserFromFirestore = (client: any): Promise<User> => {
  const documentPath = `users/${CONFIG.USER_NAME}`;
  const params = {
    auth: client,
    name: `projects/${CONFIG.PROJECT_ID}/databases/${CONFIG.DATABASE_ID}/documents/${documentPath}`,
  };
  const str = 'test';
  const ee = str as any;

  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.get(
      castedParam,
      (err: any, response: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const user: User = {
            access_token: response.data.fields.access_token.stringValue,
            refresh_token: response.data.fields.refresh_token.stringValue,
            playlistUri: response.data.fields.playlistUri.stringValue,
            deviceId: response.data.fields.deviceId.stringValue,
          };
          resolve(user);
        }
      },
    );
  });
};

export default getUserFromFirestore;
