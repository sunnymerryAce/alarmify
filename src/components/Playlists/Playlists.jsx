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
  }
  componentDidMount() {
    if (document.querySelector('.swiper-slide')) {
      this.coverflow = new Swiper('.swiper-container', {
        init: false,
        effect: 'coverflow',
        grabCursor: true,
        loop: false,
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
      this.coverflow.on('init', () => {
        this.props.onChangePlaylist(this.coverflow.activeIndex);
      });
      this.coverflow.on('slideChange', () => {
        this.props.onChangePlaylist(this.coverflow.activeIndex);
      });
      this.coverflow.init();
    }
  }

  fetchPlayLists() {
    fetch(
      'https://asia-northeast1-alarmify-5f826.cloudfunctions.net/getPlaylists',
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({
          isPlaying: this.state.isPlaying,
          playlists: json.items,
        });
      });
  }

  render() {
    return (
      <div className="Playlists swiper-container">
        <ul className="swiper-wrapper">
          {this.props.playlists.map((item, key) => {
            return (
              <li key={key} className="playlist-item swiper-slide">
                <img src={item.images[0].url} alt="" />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
