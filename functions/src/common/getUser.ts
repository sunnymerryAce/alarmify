import CONFIG from '../util/CONFIG';
const { google } = require('googleapis');
const firestore = google.firestore('v1beta1');
/**
 * Firestoreからユーザ情報を取得する
 * @param {OAuth2Client} client
 * @returns {Object} user information
 */
const getUser = client => {
  const documentPath = `users/${CONFIG.USER_NAME}`;
  const params = {
    auth: client,
    name: `projects/${CONFIG.PROJECT_ID}/databases/${CONFIG.DATABASE_ID}/documents/${documentPath}`,
  };
  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.get(params, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const user = {
          access_token: response.data.fields.access_token.stringValue,
          refresh_token: response.data.fields.refresh_token.stringValue,
          playlistUri: response.data.fields.playlistUri.stringValue,
          deviceId: response.data.fields.deviceId.stringValue,
        };
        resolve(user);
      }
    });
  });
};

export default getUser;
