import React from 'react';
import '../../../App.css';
import Timer from './index';

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
