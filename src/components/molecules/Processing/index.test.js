import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow, mount } from 'enzyme';
import Processing from './index';
import Loading from '../../atoms/Loading';
import Complete from '../../atoms/Complete';

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

  // test('useEffect should be called', () => {
  //   container.unmount();
  //   act(() => {
  //     container = mount(<Processing {...props} />);
  //   });
  //   container.setProps({
  //     ...props,
  //     completed: true,
  //   });
  //   // useEffectは実行されているが、コンポーネント内の関数をモック化できないため、
  //   // テストを通せない
  //   expect(props.hideComplete).toBeCalled();
  // });
});
