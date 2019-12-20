declare interface User {
  access_token: string;
  deviceId?: string;
  playlistUri: string;
  refresh_token: string;
  code?: string;
}

declare namespace Api {
  export interface GetUserFromFirestoreResponse
    extends firebase.functions.HttpsCallableResult {
    readonly data: {
      ok: boolean;
      user?: User;
      error?: string;
    };
  }
  export interface UpdateUserParam {
    client: any;
    user?: User;
    access_token?: string;
    refresh_token?: string;
    playlistUri?: string;
  }

  export interface SetSchedulerParam {
    client: any;
    hour: string;
    minute: string;
  }

  export interface PlaySpotifyParam {
    accessToken: string;
    playlistUri: string;
  }

  export interface GetSpotifyAccessTokenParam {
    isRefresh: boolean;
    code?: string;
    refresh_token?: string;
  }

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
}
