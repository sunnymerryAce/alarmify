import React from 'react';
import 'modern-normalize/modern-normalize.css';
import 'swiper/dist/css/swiper.min.css';
import './App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Main from './components/Main/Main';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <div>
          <Route exact path="/" component={Main} />
          <Route path="/login" component={Login} />
        </div>
      </Router>
    </div>
  );
};

export default App;
