import { RequestInit } from 'node-fetch';
import updateUser from '../common/updateUser';
import CONFIG from '../util/CONFIG';
import createURLSearchParams from '../util/functions/createURLSearchParams';
import fetchWithErrorHandling from '../util/functions/fetchWithErrorHandling';

import Api from '../../../types/Api/index';

/**
 * Spotify APIのアクセストークンを取得する
 * @param user ユーザ情報
 * @param code Authorization Code
 * @param isRefresh リフレッシュトークンを使った再取得かどうか
 * @returns Spotify token Object
 * @throws Error
 */
const getSpotifyAccessToken = async (
  param: Api.GetSpotifyAccessTokenParam,
): Promise<any> => {
  const { isRefresh, code, refresh_token } = param;
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
      refresh_token: isRefresh && refresh_token ? refresh_token : '',
    }),
  };

  const token = await fetchWithErrorHandling(
    CONFIG.SPOTIFY_API.GET_TOKEN,
    fetchOptions,
  );
  return token;
};

/**
 * 新しいSpotifyのAccessTokenを取得する
 * @param client
 * @param getSpotifyAccessTokenParam
 * @returns Promise object represents spotify token
 * @throws Error
 */
const getNewSpotifyAccessToken = async (
  client: any,
  getSpotifyAccessTokenParam: Api.GetSpotifyAccessTokenParam,
): Promise<string> => {
  const newSpotifyAccessToken = await getSpotifyAccessToken(
    getSpotifyAccessTokenParam,
  );
  // Firestoreに値を保存
  await updateUser({
    client,
    access_token: newSpotifyAccessToken.access_token,
    refresh_token: newSpotifyAccessToken.refresh_token,
  });
  return newSpotifyAccessToken.access_token;
};

export default getNewSpotifyAccessToken;
