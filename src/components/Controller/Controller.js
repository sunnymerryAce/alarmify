import React, { Component } from 'react';
import './Controller.css';

export default class Controller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
    };
    this.onClickPlayPause = this.onClickPlayPause.bind(this);
  }

  onClickPlayPause() {
    console.log(this.state);
    if (this.state.isPlaying) {
      this.fetchPause();
      this.setState({
        isPlaying: false,
      });
    } else {
      this.fetchPlay();
      this.setState({
        isPlaying: true,
      });
    }
  }
  fetchPause() {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + this.props.accessToken,
      },
    });
  }

  fetchPlay() {
    fetch(
      'https://asia-northeast1-alarmify-5f826.cloudfunctions.net/playSpotifyByHand',
      {
        method: 'GET',
        // headers: {
        //   Authorization: 'Bearer ' + this.props.accessToken,
        // },
      },
    ).then((response) => {
      console.log(response.data);
    });
    // fetch('https://api.spotify.com/v1/me/player/play', {
    //   method: 'PUT',
    //   headers: {
    //     Authorization: 'Bearer ' + this.props.accessToken,
    //   },
    // });
  }

  render() {
    return (
      <div className="Controller">
        <button onClick={this.onClickPlayPause}>Play/Pause</button>
        <button>Next</button>
      </div>
    );
  }
}
