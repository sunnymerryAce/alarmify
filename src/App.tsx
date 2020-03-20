import React from 'react';

import 'modern-normalize/modern-normalize.css';
import 'swiper/css/swiper.min.css';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './pages/Login';
import Top from './pages/Top';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={Top} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    </div>
  );
};

export default App;
