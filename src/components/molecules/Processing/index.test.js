import React from 'react';
import Processing from './index';
import Loading from '../../atoms/Loading';
import Complete from '../../atoms/Complete';
import { shallow, mount } from 'enzyme';

describe('<Processing />', () => {
  let container = null;
  const props = {
    completed: false,
    hideComplete: jest.fn(),
  };

  beforeEach(() => {
    container = shallow(<Processing {...props} />);
  });

  afterEach(() => {
    container.unmount();
    container = null;
  });

  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should have proper child components', () => {
    expect(container.find(Loading).length).toBe(1);
    expect(container.find(Complete).length).toBe(1);
  });

  // test('should loading animation start', () => {
  //   const spyHideComplete = jest.spyOn(props, 'hideComplete');
  //   container = mount(<Processing {...props} />);
  //   container.setProps({
  //     ...props,
  //     completed: true,
  //   });
  //   expect(props.hideComplete).toBeCalled();
  // });
});
