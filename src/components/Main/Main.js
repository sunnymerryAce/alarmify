import firebase from 'firebase';
import 'firebase/functions';

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

  async setScheduler() {
    this.setState({
      isFetching: true,
    });
    const data = {
      hour: this.state.hour,
      minute: this.state.minute,
      playlistUri: this.state.playlistUri,
    };
    const scheduleAlarm = firebase.functions().httpsCallable('scheduleAlarm');
    const result = await scheduleAlarm(data).catch(error => false);
    if (result) {
      console.log(result.data);
    }
    this.setState({
      isFetching: false,
    });
  }

  async fetchPlayLists() {
    const getPlaylists = firebase.functions().httpsCallable('getPlaylists');
    const result = await getPlaylists();
    this.setState({
      playlists: result.data.items,
      isLoaded: true,
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
