import React, { Component } from 'react';
import './Playlists.css';

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      playlists: [],
    };
    this.play = this.play.bind(this);
  }
  componentDidMount() {
    this.fetchPlayLists();
  }

  fetchPlayLists() {
    fetch(
      `https://api.spotify.com/v1/users/${this.props.userData.id}/playlists`,
      {
        headers: {
          Authorization: 'Bearer ' + this.props.accessToken,
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json.items);

        this.setState({
          isPlaying: this.state.isPlaying,
          playlists: json.items,
        });
      });
  }

  play(uri) {
    const bodyObject = {
      context_uri: uri,
    };
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + this.props.accessToken,
      },
      body: JSON.stringify(bodyObject),
    });
  }

  render() {
    return (
      <div className="Playlists">
        <ul>
          {this.state.playlists.map((item, key) => {
            return (
              <li
                key={key}
                className="playlist-item"
                onClick={() => {
                  this.play(item.uri);
                }}
              >
                <p>{item.name}</p>
                <img src={item.images[0].url} alt="" />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
