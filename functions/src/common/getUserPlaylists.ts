import CONFIG from '../util/CONFIG';
import fetchWithErrorHandling from '../util/functions/fetchWithErrorHandling';
import createURLSearchParams from '../util/functions/createURLSearchParams';

/**
 * ユーザのプレイリスト一覧を取得する(SpotifyAPIリクエスト)
 * @param accessToken for Spotify
 * @returns playlists object
 */
const getUserPlaylists = async (accessToken: string): Promise<Object> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  // Spotifyユーザ情報を取得
  const userInfo = await fetchWithErrorHandling(
    CONFIG.SPOTIFY_API.GET_USER_INFO,
    options,
  );

  // プレイリストを取得
  const query = createURLSearchParams({ limit: 50 });
  const uri = `${CONFIG.SPOTIFY_API.GET_PLAYLIST(
    userInfo.id,
  )}?${query.toString()}`;
  const playlistInfo = await fetchWithErrorHandling(uri, options);
  return playlistInfo;
};

export default getUserPlaylists;
