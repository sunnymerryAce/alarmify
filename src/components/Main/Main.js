import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './Main.css';
import { getHashObject } from '../../helper/util';

class Main extends Component {
  constructor(props) {
    super(props);
    if (window.location.hash) {
      const hashObject = getHashObject();
      console.log(hashObject);
      const accessToken = hashObject.access_token;
      console.log(accessToken);
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
        .then((response) => {
          console.log(response.json());
          return response.json();
        })
        .then((myJson) => {
          console.log(JSON.stringify(myJson));
        });
    } else {
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <div className="Main">
        <p>Main page</p>
      </div>
    );
  }
}

export default withRouter(Main);
