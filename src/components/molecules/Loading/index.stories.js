import React from 'react';
import '../../../App.css';
import Loading from './index';

export default {
  title: 'Loading',
};

export const Processing = () => (
  <Loading completed={false} hideComplete={() => {}} />
);
export const Complete = () => (
  <Loading completed={true} hideComplete={() => {}} />
);
