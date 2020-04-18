import 'firebase';
import { User } from '../'

declare namespace Api {
  interface GetUserFromFirestoreResponse
    extends firebase.functions.HttpsCallableResult {
    readonly data: {
      ok: boolean;
      user?: User;
      error?: string;
    };
  }
  interface UpdateUserParam {
    client: any;
    user?: User;
    access_token?: string;
    refresh_token?: string;
    playlistUri?: string;
  }

  interface SetSchedulerParam {
    client: any;
    hour: string;
    minute: string;
  }

  interface PlaySpotifyParam {
    accessToken: string;
    playlistUri: string;
  }

  interface GetSpotifyAccessTokenParam {
    isRefresh: boolean;
    code?: string;
    refresh_token?: string;
  }

  interface GetPlayListsParam {
    user: User | null;
    code: string | null;
  }

  interface GetPlaylistsResponse
    extends firebase.functions.HttpsCallableResult {
    readonly data: {
      ok: boolean;
      playlists?: SpotifyApi.ListOfUsersPlaylistsResponse;
      error?: string;
    };
  }
}

export default Api;
