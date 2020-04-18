/**
 * Configuration Data and Constants
 */
const CONFIG = {
  // your web app's Firebase configuration
  FIREBASE_CONFIG: JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG as string),
  // your Spotify client id
  SPOTIFY_CLIENT_ID: process.env.REACT_APP_SPOTIFY_CLIENT_ID as string,
  SPOTIFY_LOGIN_URI: 'https://accounts.spotify.com/authorize',
  // your web app's uri
  REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI as string,
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
};

export default CONFIG;
