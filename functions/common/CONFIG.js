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
  // INSERT YOUR CONFIGURATION INFORMATION
  // Spotiy Client ID
  SPOTIFY_CLIENT_ID: '',
  // Spotify Client Secret
  SPOTIFY_CLIENT_SECRET: '',
  // Firebase Project ID
  PROJECT_ID: '',
  // Your Application URL
  REDIRECT_URI: '',
  DATABASE_ID: '(default)',
  LOCATION_ID: 'us-central1',
  JOB_NAME: 'spotify-cron',
  USER_NAME: 'user',
  SPOTIFY_API: {
    GET_TOKEN: 'https://accounts.spotify.com/api/token',
    GET_USER_INFO: 'https://api.spotify.com/v1/me',
    GET_PLAYLIST: useId =>
      `https://api.spotify.com/v1/users/${useId}/playlists`,
    PUT_PLAY: 'https://api.spotify.com/v1/me/player/play',
  },
};
module.exports.CONFIG = CONFIG;
