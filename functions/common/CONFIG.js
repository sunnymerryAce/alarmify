const CONFIG = {
  // Error Message
  ERROR: {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    500: 'INTERNAL_SERVER_ERROR',
    502: 'BAD_GATEWAY',
    default: 'UNHANDLED_ERROR',
  },
  SPOTIFY_CLIENT_ID: '8be6bb9bbc644e93ade9e6ba983fa7b2',
  SPOTIFY_CLIENT_SECRET: '995b78a6b80c4b6c8bacb8443e24ceaf',
  PROJECT_ID: 'alarmify-5f826',
  DATABASE_ID: '(default)',
  LOCATION_ID: 'us-central1',
  JOB_NAME: 'spotify-cron',
  USER_NAME: 'user',
  REDIRECT_URI: 'https://alarmify-5f826.firebaseapp.com/',
  SPOTIFY_API: {
    GET_TOKEN: 'https://accounts.spotify.com/api/token',
    GET_USER_INFO: 'https://api.spotify.com/v1/me',
    GET_PLAYLIST: useId =>
      `https://api.spotify.com/v1/users/${useId}/playlists`,
  },
};
module.exports.CONFIG = CONFIG;
