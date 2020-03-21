import React, { forwardRef } from 'react';
import styled from 'styled-components';
import check from 'src/images/baseline-check_circle_outline-24px.svg';

interface Props {
  display: string;
}
const Complete = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const style = {
    display: props.display,
  };
  return (
    <StyledComplete ref={ref} className="Complete" style={style}>
      <img src={check} alt="check" />
    </StyledComplete>
  );
});

export default Complete;

const StyledComplete = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 70px;
  height: 70px;
  img {
    width: 100%;
  }
`;
