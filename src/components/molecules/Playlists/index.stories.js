import React from 'react';
import Playlists from './index';

import 'modern-normalize/modern-normalize.css';
import 'swiper/css/swiper.min.css';
import '../../../App.css';

export default {
  title: 'Playlists',
};

export const Default = () => {
  const playlists = [
    {
      images: [
        {
          url:
            'https://mosaic.scdn.co/640/ab67616d0000b27321d2f32ee49927dd948f5a7aab67616d0000b2734a5389bfed87c750d57c6879ab67616d0000b2735a410ed481f7e851c2e99a6bab67616d0000b273cfe0ea65058f2584a17bca19',
        },
      ],
      name: 'About Time',
    },
    {
      images: [
        {
          url:
            'https://mosaic.scdn.co/640/ab67616d0000b27321d2f32ee49927dd948f5a7aab67616d0000b2734a5389bfed87c750d57c6879ab67616d0000b2735a410ed481f7e851c2e99a6bab67616d0000b273cfe0ea65058f2584a17bca19',
        },
      ],
      name: 'About Time',
    },
    {
      images: [
        {
          url:
            'https://mosaic.scdn.co/640/ab67616d0000b27321d2f32ee49927dd948f5a7aab67616d0000b2734a5389bfed87c750d57c6879ab67616d0000b2735a410ed481f7e851c2e99a6bab67616d0000b273cfe0ea65058f2584a17bca19',
        },
      ],
      name: 'About Time',
    },
  ];
  return <Playlists playlists={playlists} onChangePlaylist={() => {}} />;
};

export const Single = () => {
  const playlists = [
    {
      images: [
        {
          url:
            'https://mosaic.scdn.co/640/ab67616d0000b27321d2f32ee49927dd948f5a7aab67616d0000b2734a5389bfed87c750d57c6879ab67616d0000b2735a410ed481f7e851c2e99a6bab67616d0000b273cfe0ea65058f2584a17bca19',
        },
      ],
      name: 'About Time',
    },
  ];
  return <Playlists playlists={playlists} onChangePlaylist={() => {}} />;
};
