import { google } from 'googleapis';

/**
 * GCPのOAuth認証を行い、クライアント認証情報を取得する
 * @returns client
 */
const getGCPAuthorizedClient = (): Promise<any> => {
  return new Promise(async (resolve) => {
    const scopes = [
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/cloud-platform',
    ];
    const client = await google.auth.getClient({
      scopes,
    });
    resolve(client);
  });
};

export default getGCPAuthorizedClient;
