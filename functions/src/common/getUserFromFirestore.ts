import CONFIG from '../util/CONFIG';
import { User } from '../../../types';
import { google } from 'googleapis';
const firestore = google.firestore('v1beta1');
/**
 * get user information from Firestore
 * @param client
 * @returns user information
 * @throws Error
 */
const getUserFromFirestore = (client: any): Promise<User> => {
  const documentPath = `users/${CONFIG.USER_NAME}`;
  const params = {
    auth: client,
    name: `projects/${CONFIG.PROJECT_ID}/databases/${CONFIG.DATABASE_ID}/documents/${documentPath}`,
  };

  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.get(
      params,
      (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          const {
            access_token,
            refresh_token,
            playlistUri,
            deviceId,
          } = response.data.fields;
          const user: User = {
            access_token: access_token.stringValue,
            refresh_token: refresh_token.stringValue,
            playlistUri: playlistUri.stringValue,
            deviceId: deviceId.stringValue,
          };
          resolve(user);
        }
      },
    );
  });
};

export default getUserFromFirestore;
