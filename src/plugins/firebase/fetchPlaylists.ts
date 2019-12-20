import { getPlaylists } from '.';
import { orderBy } from 'lodash-es';

/**
 * ユーザーのプレイリスト一覧を取得するAPI
 * @param GetPlayListsParam
 * @returns プレイリスト一覧
 */
const fetchPlaylists = async (
  param: Api.GetPlayListsParam,
): Promise<Array<SpotifyApi.PlaylistObjectSimplified>> => {
  const { data }: Api.GetPlaylistsResponse = await getPlaylists(param).catch(
    () => {
      return {
        data: {
          ok: false,
        },
      };
    },
  );
  return data.ok && data.playlists
    ? orderBy(data.playlists.items, ['name'], ['asc'])
    : [];
};

export default fetchPlaylists;
