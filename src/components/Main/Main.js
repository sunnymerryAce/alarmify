import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './Main.css';
import Timer from './Timer/Timer';
import Playlists from '../Playlists/Playlists';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      hour: '0',
      minute: '0',
      playlistUri: '',
      title: '',
      isLoaded: false,
      isFetching: false,
    };
    if (window.location.search) {
      // プレイリスト一覧を取得
      this.fetchPlayLists();
    } else {
      this.props.history.push('/login');
    }
  }

  onChangeHour(e) {
    this.setState({ hour: e.target.value });
  }

  onChangeMinute(e) {
    this.setState({ minute: e.target.value });
  }

  onChangePlaylist(index) {
    this.setState({ playlistUri: this.state.playlists[index].uri });
    this.changeTitle(index);
  }

  changeTitle(index) {
    this.setState({
      title: this.state.playlists[index].name,
    });
  }

  setScheduler() {
    this.setState({
      isFetching: true,
    });
    const data = {
      hour: this.state.hour,
      minute: this.state.minute,
      playlistUri: this.state.playlistUri,
    };

    const URI_scheduleAlarm =
      'https://asia-northeast1-alarmify-5f826.cloudfunctions.net/scheduleAlarm';
    fetch(URI_scheduleAlarm, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        this.setState({
          isFetching: false,
        });
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .catch((error) => {
        this.setState({
          isFetching: false,
        });
        console.log(error);
      });
  }

  fetchPlayLists() {
    fetch(
      'https://asia-northeast1-alarmify-5f826.cloudfunctions.net/getPlaylists',
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({
          playlists: json.items,
          isLoaded: true,
        });
      });
  }

  render() {
    return (
      <div className="Main">
        <Timer
          onChangeHour={this.onChangeHour.bind(this)}
          onChangeMinute={this.onChangeMinute.bind(this)}
        />
        <div className="title">{this.state.title}</div>
        {this.state.isLoaded && (
          <Playlists
            playlists={this.state.playlists}
            onChangePlaylist={this.onChangePlaylist.bind(this)}
            changeTitle={this.changeTitle.bind(this)}
          />
        )}
        <div className="button-set" onClick={this.setScheduler.bind(this)}>
          SET ALARM
        </div>
        {this.state.isFetching && (
          <div className="Loading">
            <div className="loader" />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Main);
