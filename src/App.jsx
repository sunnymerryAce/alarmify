import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import 'modern-normalize/modern-normalize.css';
import './App.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './components/Login/Login';
import Main from './components/Main/Main';

class App extends Component {
  render() {
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
  }
}

export default App;
