import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Swiper from 'swiper';

export const createCoverFlow = (): Swiper => {
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

interface Props {
  playlists: Array<SpotifyApi.PlaylistObjectSimplified>;
  onChangePlaylist: (index: number) => void;
}

const Playlists: React.FC<Props> = (props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    initialize();
    // 初期処理のため第二引数を指定しない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialize = () => {
    // coverFlow生成
    const coverFlow = createCoverFlow();
    setCurrentIndex(coverFlow.activeIndex);
    props.onChangePlaylist(coverFlow.activeIndex);
    coverFlow.on('slideChange', () => {
      setCurrentIndex(coverFlow.activeIndex);
      props.onChangePlaylist(coverFlow.activeIndex);
    });
  };

  return (
    <>
      <Title className="playlist-title">
        {props.playlists[currentIndex]
          ? props.playlists[currentIndex].name
          : ''}
      </Title>
      <div className="swiper-container">
        <CoverFlow className="swiper-wrapper">
          {props.playlists.map((item, key) => {
            return (
              <CoverFlowItem key={key} className="swiper-slide">
                <img
                  src={item.images.length ? item.images[0].url : ''}
                  alt=""
                />
              </CoverFlowItem>
            );
          })}
        </CoverFlow>
      </div>
    </>
  );
};

export default Playlists;

const Title = styled.div`
  font-size: 25px;
  font-weight: bold;
  letter-spacing: 0;
  padding-bottom: 2vh;
`;
const CoverFlow = styled.ul`
  list-style: none;
  padding: 0;
`;
const CoverFlowItem = styled.li`
  width: 50%;
  background: transparent;
  img {
    width: 100%;
  }
`;
