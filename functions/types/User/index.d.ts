interface User {
  access_token: string;
  deviceId?: string;
  playlistUri: string;
  refresh_token: string;
  code?: string;
}

export default User;