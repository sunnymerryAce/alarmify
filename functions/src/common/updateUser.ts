import { UpdateUserParam } from '../../../types';
import CONFIG from '../util/CONFIG';
import { google } from 'googleapis';
const firestore = google.firestore('v1beta1');

/**
 * Firestoreのユーザ情報を更新する
 * @param param
 */
const updateUser = (param: UpdateUserParam): Promise<any> => {
  const { user, client } = param;
  const access_token =
    user && user.access_token ? user.access_token : param.access_token;
  const refresh_token =
    user && user.refresh_token ? user.refresh_token : param.refresh_token;
  const playlistUri =
    user && user.playlistUri ? user.playlistUri : param.playlistUri;
  const documentPath: string = `users/${CONFIG.USER_NAME}`;
  const params = {
    auth: client,
    name: `projects/${CONFIG.PROJECT_ID}/databases/${CONFIG.DATABASE_ID}/documents/${documentPath}`,
    requestBody: {
      fields: {
        access_token: {
          stringValue: access_token ? `${access_token}` : '',
        },
        refresh_token: {
          stringValue: refresh_token ? `${refresh_token}` : '',
        },
        deviceId: {
          stringValue: '',
        },
        playlistUri: {
          stringValue: playlistUri ? `${playlistUri}` : '',
        },
      },
    },
  };
  const castedParam = <any>params;

  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.patch(
      castedParam,
      (err: any, response: any) => {
        console.log(err);
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(response.data.fields);
        }
      },
    );
  });
};

export default updateUser;
