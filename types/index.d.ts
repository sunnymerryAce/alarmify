import {
  JWT,
  Compute,
  UserRefreshClient,
} from '../functions/node_modules/google-auth-library';

declare module '*.png';
declare module '*.png';
declare module '*.jpg';

/**
 * user information registered in Firestore
 */
export interface User {
  access_token: string;
  deviceId?: string;
  playlistUri: string;
  refresh_token: string;
  code?: string;
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
  deviceId: string;
}

export interface GetSpotifyAccessTokenParam {
  isRefresh: boolean;
  user?: User;
  code?: string;
}
