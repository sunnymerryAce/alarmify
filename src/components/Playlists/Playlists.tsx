import Swiper from 'swiper';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Props {
  onChangePlaylist(index: number): void;
  playlists: Array<any>;
}
const Playlists: React.FC<Props> = props => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    console.log('useeffect');
    if (document.querySelector('.swiper-slide')) {
      const coverflow = new Swiper('.swiper-container', {
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
      if (coverflow) {
        props.onChangePlaylist(coverflow.activeIndex);
      }
      coverflow.on('slideChange', () => {
        if (coverflow) {
          props.onChangePlaylist(coverflow.activeIndex);
        }
      });
    }
  }, []);

  return (
    <div className="swiper-container">
      <Playlist className="swiper-wrapper">
        {props.playlists.map((item, key) => {
          return (
            <PlaylistItem key={key} className="swiper-slide">
              <img src={item.images[0].url} alt="" />
            </PlaylistItem>
          );
        })}
      </Playlist>
    </div>
  );
};

export default Playlists;
// export default class Playlists extends React.Component<Props, State> {
//   coverflow: Swiper | null;
//   constructor(props: Props) {
//     super(props);
//     this.state = {
//       isPlaying: false,
//     };
//     this.coverflow = null;
//   }
//   componentDidMount() {}

//   render() {
//     return (
//       <div className="swiper-container">
//         <Playlist className="swiper-wrapper">
//           {this.props.playlists.map((item, key) => {
//             return (
//               <PlaylistItem key={key} className="swiper-slide">
//                 <img src={item.images[0].url} alt="" />
//               </PlaylistItem>
//             );
//           })}
//         </Playlist>
//       </div>
//     );
//   }
// }

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
