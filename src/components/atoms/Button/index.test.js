import React from 'react';
import Button from './index';
import { shallow } from 'enzyme';

describe('<Button />', () => {
  let container = null;
  const onClickFunction = jest.fn();
  const text = 'TEST';

  beforeEach(() => {
    container = shallow(<Button onClick={onClickFunction} text={text} />);
  });

  afterEach(() => {
    container.unmount();
    container = null;
  });

  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should have proper props', () => {
    expect(container.props()).toMatchObject({
      onClick: onClickFunction,
    });
  });

  test('should have proper text', () => {
    expect(container.text()).toBe(text);
  });

  test('click event handler should be triggered', () => {
    container.simulate('click');
    expect(onClickFunction).toBeCalled();
  });
});
