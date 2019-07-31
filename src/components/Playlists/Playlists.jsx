import Swiper from 'swiper';
import React, { Component } from 'react';
import styled from 'styled-components';

const Playlist = styled.ul`
  list-style: none;
  padding: 0;
`;
const PlaylistItem = styled.li`
  width: 50%;
  background: transparent;
  img {
    width: 100%;
  }
`;
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

  render() {
    return (
      <div className="swiper-container">
        <Playlist className="swiper-wrapper">
          {this.props.playlists.map((item, key) => {
            return (
              <PlaylistItem key={key} className="swiper-slide">
                <img src={item.images[0].url} alt="" />
              </PlaylistItem>
            );
          })}
        </Playlist>
      </div>
    );
  }
}
