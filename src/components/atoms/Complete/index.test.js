import React, { createRef } from 'react';
import Complete from './index';
import { shallow } from 'enzyme';

describe('<Complete />', () => {
  let container = null;
  const complete = createRef();

  beforeEach(() => {
    container = shallow(<Complete ref={complete} display="block" />);
  });

  afterEach(() => {
    container.unmount();
    container = null;
  });

  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should exist', () => {
    expect(container.exists('.Complete')).toBe(true);
  });

  test('should have proper props', () => {
    expect(container.props()).toMatchObject({
      style: {
        display: 'block',
      },
    });
  });
});
