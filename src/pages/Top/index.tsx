import React from 'react';
import { withRouter } from 'react-router-dom';
import Alarm from 'src/components/organisms/Alarm';

const Top: React.FC = () => {
  return (
    <div className="Top">
      <Alarm />
    </div>
  );
};

export default withRouter(Top);
