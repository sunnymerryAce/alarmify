import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Alarm from '../../components/organisms/Alarm';

const Top: React.FC<RouteComponentProps> = (props) => {
  return (
    <div className="Top">
      <Alarm {...props} />
    </div>
  );
};

export default withRouter(Top);
