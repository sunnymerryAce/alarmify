import React from 'react';
import Timer from './index';

import 'modern-normalize/modern-normalize.css';
import 'swiper/css/swiper.min.css';
import '../../../App.css';

export default {
  title: 'Timer',
  parameters: {
    backgrounds: [
      { name: 'default', value: '#000000', default: true },
      { name: 'green', value: 'rgba(24, 92, 49, 1)' },
    ],
  },
};

export const Default = () => <Timer setHour={() => {}} setMinute={() => {}} />;
