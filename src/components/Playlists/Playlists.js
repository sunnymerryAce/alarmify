import Swiper from 'swiper';
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
    this.fetchPlayLists();
  }
  componentDidUpdate() {
    if (document.querySelector('.swiper-slide')) {
      this.coverflow = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        },
        speed: 500,
      });
    }
    console.log(document.querySelector('.swiper-slide'));
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
      <div className="Playlists swiper-container">
        <ul className="swiper-wrapper">
          {this.state.playlists.map((item, key) => {
            return (
              <li
                key={key}
                className="playlist-item swiper-slide"
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
