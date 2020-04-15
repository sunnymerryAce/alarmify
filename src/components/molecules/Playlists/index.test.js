import React from 'react';
import Swiper from 'swiper';
import Playlists, { createCoverFlow } from './index';
import { shallow } from 'enzyme';

export function createStartTouchEventObject({ x = 0, y = 0 }) {
  return { touches: [{ clientX: x, clientY: y }] };
}

export function createMoveTouchEventObject({ x = 0, y = 0 }) {
  return { changedTouches: [{ clientX: x, clientY: y }] };
}

describe('createCoverFlow', () => {
  const coverFlow = createCoverFlow();
  expect(coverFlow instanceof Swiper).toBe(true);
});

describe('<Playlists />', () => {
  const testImageUrl = 'test.png';
  const testTitle = 'title';
  const playlists = [
    {
      href: '',
      id: '',
      images: [
        {
          url: testImageUrl,
        },
      ],
      name: testTitle,
      snapshot_id: '',
      type: 'playlist',
      uri: '',
    },
    {
      href: '',
      id: '',
      images: [],
      name: '',
      snapshot_id: '',
      type: 'playlist',
      uri: '',
    },
  ];
  const onChangePlaylist = (number) => {
    console.log(number);
  };
  const container = shallow(
    <Playlists playlists={playlists} onChangePlaylist={onChangePlaylist} />,
  );

  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should have proper components', () => {
    expect(container.find('.playlist-title').length).toBe(1);
    expect(container.find('.swiper-container').length).toBe(1);
  });

  test('should have proper title in initial state', () => {
    expect(container.find('.playlist-title').text()).toBe(testTitle);
  });

  test('should have proper length of slides', () => {
    expect(container.find('.swiper-slide').length).toBe(2);
  });

  test('should have proper image src', () => {
    expect(
      container
        .find('.swiper-slide')
        .at(0)
        .find('img')
        .props(),
    ).toMatchObject({
      src: testImageUrl,
    });
    expect(
      container
        .find('.swiper-slide')
        .at(1)
        .find('img')
        .props(),
    ).toMatchObject({
      src: '',
    });
  });
});
