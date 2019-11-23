import { UpdateUserParam } from '../../../types';
import CONFIG from '../util/CONFIG';
import { google } from 'googleapis';
const firestore = google.firestore('v1beta1');

const createRequestBody = (param: UpdateUserParam): Object => {
  const requestBody: any = { fields: {} };
  const { user } = param;
  requestBody.fields.deviceId.stringValue = '';
  const access_token =
    user && user.access_token ? user.access_token : param.access_token;
  if (access_token) requestBody.fields.access_token.stringValue = access_token;
  const refresh_token =
    user && user.refresh_token ? user.refresh_token : param.refresh_token;
  if (refresh_token)
    requestBody.fields.refresh_token.stringValue = refresh_token;
  const playlistUri =
    user && user.playlistUri ? user.playlistUri : param.playlistUri;
  if (playlistUri) requestBody.fields.playlistUri.stringValue = playlistUri;

  return requestBody;
};

/**
 * Firestoreのユーザ情報を更新する
 * @param param
 */
const updateUser = (param: UpdateUserParam): Promise<any> => {
  const documentPath: string = `users/${CONFIG.USER_NAME}`;
  const requestBody: Object = createRequestBody(param);
  const params = {
    auth: param.client,
    name: `projects/${CONFIG.PROJECT_ID}/databases/${CONFIG.DATABASE_ID}/documents/${documentPath}`,
    requestBody,
  };
  const castedParam = <any>params;

  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.patch(
      castedParam,
      (error: any, response: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.data.fields);
        }
      },
    );
  });
};

export default updateUser;
