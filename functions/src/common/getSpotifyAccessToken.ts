import CONFIG from '../util/CONFIG';
import { User } from '../../../types/index';
import createURLSearchParams from '../util/functions/createURLSearchParams';

/**
 * Spotify APIのアクセストークンを取得する
 * @param user ユーザ情報
 * @param isRefresh リフレッシュトークンを使った再取得かどうか
 * @returns Spotify token Object
 */
const getSpotifyAccessToken = async (
  user: User,
  isRefresh: boolean,
): Promise<any> => {
  const secretKey = `${CONFIG.SPOTIFY_CLIENT_ID}:${CONFIG.SPOTIFY_CLIENT_SECRET}`;
  const base64 = Buffer.from(secretKey).toString('base64');
  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${base64}`,
    },
    body: createURLSearchParams({
      grant_type: isRefresh ? 'refresh_token' : 'authorization_code',
      code: isRefresh ? '' : user.code,
      redirect_uri: isRefresh ? '' : CONFIG.REDIRECT_URI,
      refresh_token: isRefresh ? user.refresh_token : '',
    }),
  };
  try {
    const response = await fetch(CONFIG.SPOTIFY_API.GET_TOKEN, params);
    return await response.json();
  } catch (err) {
    console.log(`error occurred  ${err}`);
    return err;
  }
};

export default getSpotifyAccessToken;
