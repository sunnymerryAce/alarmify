import CONFIG from '../util/CONFIG';
import { google, firestore_v1beta1 } from 'googleapis';

import Api from '../../../types/Api/index';

const firestore = google.firestore('v1beta1');

const createRequestBody = (param: Api.UpdateUserParam): Object => {
  const requestBody: any = {
    fields: {},
  };
  // firestoreに登録されているユーザー情報
  const { user } = param;
  const access_token =
    user && user.access_token ? user.access_token : param.access_token;
  if (access_token) {
    requestBody.fields.access_token = { stringValue: access_token };
  }
  const refresh_token =
    user && user.refresh_token ? user.refresh_token : param.refresh_token;
  if (refresh_token) {
    requestBody.fields.refresh_token = { stringValue: refresh_token };
  }
  // playlistUriはクライアントからの指定を優先する
  const playlistUri = param.playlistUri ? param.playlistUri : user?.playlistUri;
  if (playlistUri) {
    requestBody.fields.playlistUri = { stringValue: playlistUri };
  }
  return requestBody;
};

/**
 * Firestoreのユーザ情報を更新する
 * @param param
 */
const updateUser = (param: Api.UpdateUserParam): Promise<any> => {
  const requestBody: any = createRequestBody(param);
  const fieldPaths: Array<string> = [];
  Object.entries(requestBody.fields).forEach(([key, value]) => {
    fieldPaths.push(key);
  });
  const patchParam: firestore_v1beta1.Params$Resource$Projects$Databases$Documents$Patch = {
    auth: param.client,
    name: `projects/${CONFIG.PROJECT_ID}/databases/${CONFIG.DATABASE_ID}/documents/users/${CONFIG.USER_NAME}`,
    'updateMask.fieldPaths': fieldPaths,
    requestBody,
  };

  return new Promise((resolve, reject) => {
    firestore.projects.databases.documents.patch(
      patchParam,
      (error: any, response: any): void => {
        if (error) {
          reject(error);
        } else {
          resolve(response.data);
        }
      },
    );
  });
};

export default updateUser;
