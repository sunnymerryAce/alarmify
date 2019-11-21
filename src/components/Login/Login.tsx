import React from 'react';
import { withRouter } from 'react-router-dom';
import CONFIG from '../../helper/CONFIG';

const Login: React.FC = () => {
  const redirectURL = () => {
    const clientId = CONFIG.SPOTIFY_CLIENT_ID;
    // const responseType = 'token';
    const responseType = 'code';
    const state = 'sometext';
    const redirectUri = encodeURIComponent(CONFIG.REDIRECT_URI);
    const scopes = encodeURIComponent(
      'user-read-private user-read-playback-state user-modify-playback-state playlist-read-collaborative',
    );
    const URL = `https://accounts.spotify.com/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;
    return URL;
  };

  return (
    <div className="Login">
      <p>Login page</p>
      <a href={redirectURL()}>LOGIN TO SPOTIFY</a>
    </div>
  );
};

export default withRouter(Login);
