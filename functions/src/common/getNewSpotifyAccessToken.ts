import { RequestInit } from 'node-fetch';
import CONFIG from '@/util/CONFIG';
import createURLSearchParams from '@/util/functions/createURLSearchParams';
import fetchWithErrorHandling from '@/util/functions/fetchWithErrorHandling';
import updateUser from './updateUser';

interface GetSpotifyAccessTokenParam {
  isRefresh: boolean;
  code?: string;
  refresh_token?: string;
}

/**
 * Spotify APIのアクセストークンを取得する
 * @param user ユーザ情報
 * @param code Authorization Code
 * @param isRefresh リフレッシュトークンを使った再取得かどうか
 * @returns Spotify token Object
 * @throws Error
 */
const getSpotifyAccessToken = async (
  param: GetSpotifyAccessTokenParam,
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
    body: isRefresh ? createURLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }) : createURLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: CONFIG.REDIRECT_URI,
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
  getSpotifyAccessTokenParam: GetSpotifyAccessTokenParam,
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
