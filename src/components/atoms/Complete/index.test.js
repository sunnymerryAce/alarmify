import React, { createRef } from 'react';
import Complete from './index';
import { shallow } from 'enzyme';

describe('<Complete />', () => {
  const complete = createRef();
  const container = shallow(<Complete ref={complete} display='block'/>);

  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should exist', () => {
    expect(container.exists('.Complete')).toBe(true);
  });

  test('should have proper props', () => {
    expect(container.props()).toMatchObject({
      style: {
        display: 'block'
      },
    });
  });
});
