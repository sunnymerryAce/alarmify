import { RequestInit } from 'node-fetch';
import CONFIG from '../util/CONFIG';
import fetchWithErrorHandling from '../util/functions/fetchWithErrorHandling';
import createURLSearchParams from '../util/functions/createURLSearchParams';
import { PlaySpotifyParam } from '../../../types';

/**
 * 接続先デバイスから音楽を再生する(Spotify APIリクエスト)
 * @param param
 * @returns result
 */
const playSpotify = async (param: PlaySpotifyParam): Promise<any> => {
  const { accessToken, playlistUri, deviceId } = param;
  const uri = deviceId
    ? `${CONFIG.SPOTIFY_API.PUT_PLAY}?${createURLSearchParams({
        device_id: deviceId,
      }).toString()}`
    : CONFIG.SPOTIFY_API.PUT_PLAY;
  const bodyObject = {
    context_uri: playlistUri,
  };
  const fetchOptions: RequestInit = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(bodyObject),
  };
  return await fetchWithErrorHandling(uri, fetchOptions);
};

export default playSpotify;
