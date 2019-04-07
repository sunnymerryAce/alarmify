import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './Main.css';
import { getHashObject } from '../../helper/util';
import Controller from '../Controller/Controller';
import Playlists from '../Playlists/Playlists';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { userData: {} };

    if (window.location.hash) {
      const hashObject = getHashObject();
      const accessToken = hashObject.access_token;
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error();
          }
        })
        .then((json) => {
          this.setState({
            userData: json,
            accessToken: accessToken,
            isLoaded: true,
          });
        })
        .catch((error) => {
          this.props.history.push('/login');
        });
    } else {
      this.props.history.push('/login');
    }
  }

  setScheduler() {
    fetch(
      'https://asia-northeast1-alarmify-5f826.cloudfunctions.net/scheduleAlarm',
    )
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then((json) => {
        console.log(json);
      });
  }

  render() {
    return (
      <div className="Main">
        <p>Welcome, {this.state.userData.display_name}!</p>
        <Controller
          userData={this.state.userData}
          accessToken={this.state.accessToken}
        />
        <button onClick={this.setScheduler}>Set Cloud Scheduler</button>
        {this.state.isLoaded && (
          <Playlists
            userData={this.state.userData}
            accessToken={this.state.accessToken}
          />
        )}
      </div>
    );
  }
}

export default withRouter(Main);
