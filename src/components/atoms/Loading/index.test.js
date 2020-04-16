import React from 'react';
import Loading from './index';
import { shallow } from 'enzyme';

describe('<Loading />', () => {
  let container = null;

  beforeEach(() => {
    container = shallow(<Loading />);
  });

  afterEach(() => {
    container.unmount();
    container = null;
  });

  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should exist', () => {
    expect(container.exists('.Loading')).toBe(true);
  });
});
