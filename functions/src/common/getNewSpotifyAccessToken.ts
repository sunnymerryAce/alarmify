import updateUser from '../common/updateUser';
import getSpotifyAccessToken from '../common/getSpotifyAccessToken';
import { GetSpotifyAccessTokenParam } from '../../../types/index';

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
  return new Promise(async (resolve) => {
    const newSpotifyAccessToken = await getSpotifyAccessToken(
      getSpotifyAccessTokenParam,
    );
    console.log(newSpotifyAccessToken);
    // Firestoreに値を保存
    await updateUser({
      client,
      access_token: newSpotifyAccessToken.access_token,
      refresh_token: newSpotifyAccessToken.refresh_token,
    });
    resolve(newSpotifyAccessToken.access_token);
  });
};

export default getNewSpotifyAccessToken;
