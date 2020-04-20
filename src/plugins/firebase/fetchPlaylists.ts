import { getPlaylists } from '.';
import { orderBy } from 'lodash-es';

import { GetPlayListsParam, GetPlaylistsResponse } from 'api';

/**
 * ユーザーのプレイリスト一覧を取得するAPI
 * @param GetPlayListsParam
 * @returns プレイリスト一覧
 */
const fetchPlaylists = async (
  param: GetPlayListsParam,
): Promise<Array<SpotifyApi.PlaylistObjectSimplified>> => {
  const { data }: GetPlaylistsResponse = await getPlaylists(param).catch(
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
