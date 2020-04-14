import React from 'react';
import Loading from './index';
import { shallow } from 'enzyme';

describe('<Loading />', () => {
  const container = shallow(<Loading />);
  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should exist', () => {
    expect(container.exists('.Loading')).toBe(true);
  });
});
