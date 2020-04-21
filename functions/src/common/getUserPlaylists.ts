import { RequestInit } from 'node-fetch';
import CONFIG from '@/util/CONFIG';
import fetchWithErrorHandling from '@/util/functions/fetchWithErrorHandling';
import createURLSearchParams from '@/util/functions/createURLSearchParams';

/**
 * get User's playlists
 * @param accessToken for Spotify
 * @returns playlists object
 * @throws Error
 */
const getUserPlaylists = async (
  accessToken: string,
): Promise<SpotifyApi.ListOfUsersPlaylistsResponse> => {
  const fetchOptions: RequestInit = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  // Spotifyユーザ情報を取得
  const userInfo: SpotifyApi.CurrentUsersProfileResponse = await fetchWithErrorHandling<
    SpotifyApi.CurrentUsersProfileResponse
  >(CONFIG.SPOTIFY_API.GET_USER_INFO, fetchOptions);
  // プレイリストを取得
  const uri = `${CONFIG.SPOTIFY_API.GET_PLAYLIST(
    userInfo.id,
  )}?${createURLSearchParams({
    limit: 50,
  }).toString()}`;
  const playlistInfo: SpotifyApi.ListOfUsersPlaylistsResponse = await fetchWithErrorHandling<
    SpotifyApi.ListOfUsersPlaylistsResponse
  >(uri, fetchOptions);
  return playlistInfo;
};

export default getUserPlaylists;
