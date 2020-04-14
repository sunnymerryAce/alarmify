import React from 'react';
import Processing from './index';
import Loading from '../../atoms/Loading';
import Complete from '../../atoms/Complete';
import { shallow } from 'enzyme';

describe('<Processing />', () => {
  const props = {
    completed: false,
    hideComplete: jest.fn(),
  };

  const container = shallow(<Processing {...props} />);
  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should have proper child components', () => {
    expect(container.find(Loading).length).toBe(1);
    expect(container.find(Complete).length).toBe(1);
  });

  // test('should loading animation start', () => {
  //   container.setProps({
  //     ...props,
  //     completed: true,
  //   });
  //   expect(container.html()).not.toMatchSnapshot();
  // });
});
