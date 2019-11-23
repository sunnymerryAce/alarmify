import { RequestInit } from 'node-fetch';
import updateUser from '../common/updateUser';
import CONFIG from '../util/CONFIG';
import { GetSpotifyAccessTokenParam } from '../../../types/index';
import createURLSearchParams from '../util/functions/createURLSearchParams';
import fetchWithErrorHandling from '../util/functions/fetchWithErrorHandling';

/**
 * Spotify APIのアクセストークンを取得する
 * @param user ユーザ情報
 * @param code Authorization Code
 * @param isRefresh リフレッシュトークンを使った再取得かどうか
 * @returns Spotify token Object
 */
const getSpotifyAccessToken = async (
  param: GetSpotifyAccessTokenParam,
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const { isRefresh, code, user } = param;
    const secretKey = `${CONFIG.SPOTIFY_CLIENT_ID}:${CONFIG.SPOTIFY_CLIENT_SECRET}`;
    const base64 = Buffer.from(secretKey).toString('base64');
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64}`,
      },
      body: createURLSearchParams({
        grant_type: isRefresh ? 'refresh_token' : 'authorization_code',
        code: isRefresh ? '' : code,
        redirect_uri: isRefresh ? '' : CONFIG.REDIRECT_URI,
        refresh_token: isRefresh && user ? user.refresh_token : '',
      }),
    };

    try {
      const response = await fetchWithErrorHandling(
        CONFIG.SPOTIFY_API.GET_TOKEN,
        fetchOptions,
      );
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 新しいSpotifyのAccessTokenを取得する
 * @param client
 * @param getSpotifyAccessTokenParam
 * @returns Promise object represents spotify token
 */
const getNewSpotifyAccessToken = (
  client: any,
  getSpotifyAccessTokenParam: GetSpotifyAccessTokenParam,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newSpotifyAccessToken = await getSpotifyAccessToken(
        getSpotifyAccessTokenParam,
      );
      // Firestoreに値を保存
      await updateUser({
        client,
        access_token: newSpotifyAccessToken.access_token,
        refresh_token: newSpotifyAccessToken.refresh_token,
      });
      resolve(newSpotifyAccessToken.access_token);
    } catch (error) {
      reject(error);
    }
  });
};

export default getNewSpotifyAccessToken;
