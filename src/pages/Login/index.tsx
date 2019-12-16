import React from 'react';
import { withRouter } from 'react-router-dom';
import CONFIG from '../../util/CONFIG';
import createURLSearchParamsFromObject from '../../util/functions/createURLSearchParamsFromObject';

const redirectURL = (): string => {
  const url = new URL('https://accounts.spotify.com/authorize');
  const params = createURLSearchParamsFromObject({
    response_type: 'code',
    client_id: CONFIG.SPOTIFY_CLIENT_ID,
    redirect_uri: CONFIG.REDIRECT_URI,
    scope:
      'user-read-private user-read-playback-state user-modify-playback-state playlist-read-collaborative',
  });
  url.search = params.toString();
  return url.href;
};

const Login: React.FC = () => {
  const href: string = redirectURL();
  return (
    <div className="Login">
      <a href={href}>LOGIN TO SPOTIFY</a>
    </div>
  );
};

export default withRouter(Login);
