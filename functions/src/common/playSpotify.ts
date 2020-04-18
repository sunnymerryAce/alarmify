import { RequestInit } from 'node-fetch';
import CONFIG from '../util/CONFIG';
import fetchWithErrorHandling from '../util/functions/fetchWithErrorHandling';

import Api from '../../../types/Api/index';

/**
 * 接続先デバイスから音楽を再生する(Spotify APIリクエスト)
 * @param param
 * @returns result
 * @throws Error
 */
const playSpotify = async (param: Api.PlaySpotifyParam): Promise<any> => {
  const { accessToken, playlistUri } = param;
  const uri = CONFIG.SPOTIFY_API.PUT_PLAY;
  const fetchOptions: RequestInit = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      context_uri: playlistUri,
    }),
  };
  const res = await fetchWithErrorHandling(uri, fetchOptions);
  return res;
};

export default playSpotify;
