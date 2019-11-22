import fetch, { RequestInit } from 'node-fetch';
import CONFIG from '../util/CONFIG';
import { GetSpotifyAccessTokenParam } from '../../../types/index';
import createURLSearchParams from '../util/functions/createURLSearchParams';

/**
 * Spotify APIのアクセストークンを取得する
 * @param user ユーザ情報
 * @param code Authorization Code
 * @param isRefresh リフレッシュトークンを使った再取得かどうか
 * @returns Spotify token Object
 */
const getSpotifyAccessToken = async (
  args: GetSpotifyAccessTokenParam,
): Promise<any> => {
  const { isRefresh, code, user } = args;
  const secretKey = `${CONFIG.SPOTIFY_CLIENT_ID}:${CONFIG.SPOTIFY_CLIENT_SECRET}`;
  const base64 = Buffer.from(secretKey).toString('base64');
  const params: RequestInit = {
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
    const response = await fetch(CONFIG.SPOTIFY_API.GET_TOKEN, params);
    return await response.json();
  } catch (error) {
    console.log(`error occurred  ${error}`);
    return error;
  }
};

export default getSpotifyAccessToken;
