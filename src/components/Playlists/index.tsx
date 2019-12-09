import Swiper from 'swiper';
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  onChangePlaylist(index: number): void;
  playlists: Array<any>;
}

/**
 * Coverflowを生成する
 * @returns Swiper Object
 */
const createCoverFlow = (): Swiper => {
  return new Swiper('.swiper-container', {
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
};

const Playlists: React.FC<Props> = (props) => {
  useEffect(() => {
    const coverFlow = createCoverFlow();
    if (coverFlow) {
      props.onChangePlaylist(coverFlow.activeIndex);
      coverFlow.on('slideChange', () => {
        props.onChangePlaylist(coverFlow.activeIndex);
      });
    }
  }, []);

  return (
    <div className="swiper-container">
      <Playlist className="swiper-wrapper">
        {props.playlists.map((item, key) => {
          return (
            <PlaylistItem key={key} className="swiper-slide">
              <img src={item.images.length ? item.images[0].url : ''} alt="" />
            </PlaylistItem>
          );
        })}
      </Playlist>
    </div>
  );
};

export default Playlists;

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
