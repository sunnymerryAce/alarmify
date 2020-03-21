import React from 'react';
import styled from 'styled-components';

interface Props {
  onClick: (props: any) => void;
  text: string;
}

const Button: React.FC<Props> = (props) => {
  return (
    <StyledButton className="Button" onClick={props.onClick}>
      {props.text}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.div`
  background-color: #1db954;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  border-radius: 50px;
  width: 70%;
  padding: 10px 0;
  margin: 7vh auto;
`;
