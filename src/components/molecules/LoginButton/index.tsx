import React from 'react';
import Button from '../../atoms/Button';
import CONFIG from '../../../util/CONFIG';
import createURLSearchParamsFromObject from '../../../util/functions/createURLSearchParamsFromObject';

const LoginButton: React.FC = () => {
  const redirectURL = (): string => {
    const url = new URL(CONFIG.SPOTIFY_LOGIN_URI);
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

  const login = () => {
    window.location.href = redirectURL();
  };

  return (
    <div className="LoginButton">
      <Button onClick={login} text="LOGIN TO SPOTIFY"></Button>
    </div>
  );
};

export default LoginButton;
