import React, { Component } from 'react';
import CONFIG from '../../helper/CONFIG';

export default class Login extends Component {
  constructor() {
    super();
  }

  redirectURL() {
    const clientId = CONFIG.SPOTIFY_CLIENT_ID;
    // const responseType = 'token';
    const responseType = 'code';
    const state = 'sometext';
    const redirectUri = CONFIG.REDIRECT_URI;
    const scopes =
      'user-read-private user-read-playback-state user-modify-playback-state playlist-read-collaborative';
    const URL = `https://accounts.spotify.com/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;
    return URL;
  }

  render() {
    return (
      <div className="Login">
        <p>Login page</p>
        <a href={this.redirectURL()}>LOGIN TO SPOTIFY</a>
      </div>
    );
  }
}
