import { getPlaylists } from '.';
import { orderBy } from 'lodash-es';
import { User } from '@functions/types/user';
export interface GetPlayListsParam {
  user: User | null;
  code: string | null;
}
export interface GetPlaylistsResponse
  extends firebase.functions.HttpsCallableResult {
  readonly data: {
    ok: boolean;
    playlists?: SpotifyApi.ListOfUsersPlaylistsResponse;
    error?: string;
  };
}

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
