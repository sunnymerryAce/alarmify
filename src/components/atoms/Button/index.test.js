import React from 'react';
import Button from './index';
import { shallow } from 'enzyme';

describe('<Button />', () => {
  const onClickFunction = jest.fn();
  const text = 'TEST';

  const container = shallow(<Button onClick={onClickFunction} text={text} />);
  test('should match the snapshot', () => {
    expect(container.html()).toMatchSnapshot();
  });

  test('should have proper props', () => {
    expect(container.find('.Button').props()).toMatchObject({
      onClick: onClickFunction,
    });
  });

  test('should have proper text', () => {
    expect(container.find('.Button').text()).toBe(text);
  });

  test('click event handler should be triggered', () => {
    container.find('.Button').simulate('click');
    expect(onClickFunction).toBeCalled();
  });
});
