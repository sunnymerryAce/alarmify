import React from 'react';

import 'modern-normalize/modern-normalize.css';
import 'swiper/css/swiper.min.css';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={Main} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    </div>
  );
};

export default App;
