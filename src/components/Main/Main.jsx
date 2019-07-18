import anime from 'animejs';
import firebase from 'firebase';
import 'firebase/functions';

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './Main.scss';
import check from '../../images/baseline-check_circle_outline-24px.svg'; // Tell Webpack this JS file uses this image

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
      isLoading: true,
      isFetching: false,
    };
    this.$loader = React.createRef();
    this.$complete = React.createRef();
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
    await scheduleAlarm(data).catch(error => false);
    this.showComplete();
  }

  async fetchPlayLists() {
    const getPlaylists = firebase.functions().httpsCallable('getPlaylists');
    const result = await getPlaylists();
    this.setState({
      playlists: result.data.items,
      isLoading: false,
    });
  }

  showComplete() {
    const timeline = anime.timeline();
    // ローディング消す
    timeline.add({
      targets: [this.$loader.current],
      scale: {
        value: [1, 0],
        duration: 200,
        easing: 'easeOutQuart',
      },
      complete: () => {
        this.$complete.current.style.display = 'block';
      },
    });
    // チェックマーク出す
    timeline.add({
      targets: [this.$complete.current],
      scale: {
        value: [0, 1],
        duration: 300,
        easing: 'cubicBezier(.3,1.04,.86,1.47)',
      },
    });
    // チェックマーク消す
    timeline.add({
      targets: [this.$complete.current],
      scale: {
        value: [1, 0],
        duration: 200,
        delay: 500,
        easing: 'easeOutQuart',
      },
      complete: () => {
        this.$loader.current.style.transform = '';
        this.$complete.current.style.display = 'none';
        this.setState({
          isFetching: false,
        });
      },
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
        {!this.state.isLoading && (
          <Playlists
            playlists={this.state.playlists}
            onChangePlaylist={this.onChangePlaylist.bind(this)}
            changeTitle={this.changeTitle.bind(this)}
          />
        )}
        <div className="button-set" onClick={this.setScheduler.bind(this)}>
          SET ALARM
        </div>
        <div
          className="Loading"
          style={{ display: this.state.isFetching ? 'block' : 'none' }}
        >
          <div className="loader" ref={this.$loader} />
          <div className="complete" ref={this.$complete}>
            <img src={check} alt="check" />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Main);
