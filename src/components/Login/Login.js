import React, { Component } from 'react';
import './Login.css';

export default class Login extends Component {
  constructor() {
    super();
    console.log('login');
  }

  redirectURL() {
    const clientId = '8be6bb9bbc644e93ade9e6ba983fa7b2';
    const responseType = 'token';
    const state = 'sometext';
    const redirectUri = 'https://alarmify-5f826.firebaseapp.com/';
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
