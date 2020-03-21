import React from 'react';
import Processing from './index';

import 'modern-normalize/modern-normalize.css';
import 'swiper/css/swiper.min.css';
import '../../../App.css';

export default {
  title: 'Processing',
};

export const Loading = () => (
  <Processing completed={false} hideComplete={() => {}} />
);
export const Complete = () => (
  <Processing completed={true} hideComplete={() => {}} />
);
