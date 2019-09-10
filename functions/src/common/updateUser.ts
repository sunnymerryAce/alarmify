/**
 * Firestoreのユーザ情報を更新する
 * @param {Object} params
 * @param {Object} params.user user information
 * @param {OAuth2Client} params.client
 * @param {String} params.access_token
 * @param {String} params.refresh_token
 * @param {String} params.playlistUri
 * @returns {Object} fields of document
 */
const updateUser = ({
  user,
  client,
  access_token,
  refresh_token,
  playlistUri,
}) => {
  const documentPath = `users/${userName}`;
  const params = {
    auth: client,
    name: `projects/${projectId}/databases/${databaseId}/documents/${documentPath}`,
    requestBody: {
      fields: {
        access_token: {
          stringValue: access_token
            ? `${access_token}`
            : `${user.access_token}`,
        },
        refresh_token: {
          stringValue: refresh_token
            ? `${refresh_token}`
            : `${user.refresh_token}`,
        },
        deviceId: {
          stringValue: '',
        },
        playlistUri: {
          stringValue: playlistUri ? `${playlistUri}` : `${user.playlistUri}`,
        },
      },
    },
  };
  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.patch(params, (err, response) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(response.data.fields);
      }
    });
  });
};
