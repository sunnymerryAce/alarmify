import React from 'react';
import LoginButton, { redirectURL, login } from './index';
import Button from '../../atoms/Button';
import { shallow, mount } from 'enzyme';

const expectedUrl =
  'https://accounts.spotify.com/authorize?response_type=code&client_id=8be6bb9bbc644e93ade9e6ba983fa7b2&redirect_uri=https%3A%2F%2Falarmify-5f826.web.app%2F&scope=user-read-private+user-read-playback-state+user-modify-playback-state+playlist-read-collaborative';

describe('redirectURL', () => {
  test('should return proper url', () => {
    expect(redirectURL()).toBe(expectedUrl);
  });
});

describe('login', () => {
  test('proper url should be assigned to href', () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });
    login();
    expect(window.location.href).toBe(expectedUrl);
  });
});

describe('<LoginButton />', () => {
  const container = shallow(<LoginButton />);

  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should have Button component', () => {
    expect(container.find(Button).length).toBe(1);
  });

  test('Button component should have proper props', () => {
    expect(container.find(Button).props()).toMatchObject({
      onClick: login,
      text: 'LOGIN TO SPOTIFY',
    });
  });
});

// 単体テストとしては不要？
describe('<LoginButton /> mount', () => {
  const containerMounted = mount(<LoginButton />);
  test('should have proper text', () => {
    expect(
      containerMounted
        .find('.Button')
        .hostNodes()
        .text(),
    ).toBe('LOGIN TO SPOTIFY');
  });
});
