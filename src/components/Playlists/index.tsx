import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Swiper from 'swiper';

interface Props {
  playlists: Array<SpotifyApi.PlaylistObjectSimplified>;
  setPlaylistUri: React.Dispatch<React.SetStateAction<string>>;
}

const Playlists: React.FC<Props> = (props) => {
  const [coverFlow, setCoverFlow] = useState<Swiper>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    initialize();
  }, []);

  // スライダーレンダリング後
  useEffect(() => {
    if (!coverFlow) return;
    setCurrentPlaylist(coverFlow.activeIndex);
    addCoverFlowEvent(coverFlow);
  }, [coverFlow]);

  const initialize = (): void => {
    setCoverFlow(createCoverFlow());
  };

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

  const addCoverFlowEvent = (coverFlow: Swiper): void => {
    coverFlow.on('slideChange', () => {
      setCurrentPlaylist(coverFlow.activeIndex);
    });
  };

  const setCurrentPlaylist = (index: number): void => {
    setCurrentIndex(index);
    props.setPlaylistUri(props.playlists[index].uri);
  };

  return (
    <>
      <Title>{props.playlists[currentIndex].name}</Title>
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
