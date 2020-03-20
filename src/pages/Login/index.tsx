import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import LoginButton from '../../components/molecules/LoginButton';

const Login: React.FC = () => {
  return (
    <StyledLogin className="Login">
      <LoginButton />
    </StyledLogin>
  );
};

export default withRouter(Login);

const StyledLogin = styled.div`
  position: fixed;
  top: 35vh;
  width: 100vw;
`;
