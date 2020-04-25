import * as functions from 'firebase-functions';

/**
 * Configuration Data and Constants
 */
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
  SPOTIFY_CLIENT_ID: functions.config().alarmify.spotify_client_id as string,
  SPOTIFY_CLIENT_SECRET: functions.config().alarmify.spotify_client_secret as string,
  PROJECT_ID: functions.config().alarmify.project_id as string,
  DATABASE_ID: functions.config().alarmify.database_id as string,
  LOCATION_ID: functions.config().alarmify.location_id as string,
  JOB_NAME: functions.config().alarmify.job_name as string,
  USER_NAME: functions.config().alarmify.user_name as string,
  REDIRECT_URI: functions.config().alarmify.redirect_uri as string,
  SPOTIFY_API: {
    GET_TOKEN: 'https://accounts.spotify.com/api/token',
    GET_USER_INFO: 'https://api.spotify.com/v1/me',
    GET_PLAYLIST: (useId: string): string => `https://api.spotify.com/v1/users/${useId}/playlists`,
    PUT_PLAY: 'https://api.spotify.com/v1/me/player/play',
  },
  REG_EXP: {
    ERROR: {
      401: new RegExp('UNAUTHORIZED'),
    },
  },
};

export default CONFIG;
