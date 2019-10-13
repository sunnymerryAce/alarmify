import anime from 'animejs';
import firebase from 'firebase';
import 'firebase/functions';
import { orderBy } from 'lodash-es';

import React from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Timer from './Timer/Timer';
import Playlists from '../Playlists/Playlists';
import { getQueryObject } from '../../helper/functions';

interface Props extends RouteComponentProps {}
interface State {
  playlists: Array<any>;
  hour: string;
  minute: string;
  playlistUri: string;
  title: string;
  isFetching: boolean;
  isLoaded: boolean;
}

const check = require('../../images/baseline-check_circle_outline-24px.svg');

class Main extends React.Component<Props, State> {
  $loader: HTMLElement | null;
  $complete: HTMLElement | null;
  constructor(props: Props) {
    super(props);
    this.state = {
      playlists: [],
      hour: '0',
      minute: '0',
      playlistUri: '',
      title: '',
      isFetching: true,
      isLoaded: false,
    };
    this.$loader = null;
    this.$complete = null;

    this.initialize();
  }

  async initialize() {
    // Firestoreの情報を参照
    const getUser = firebase
      .functions()
      .httpsCallable('getUser');
    const { data } = await getUser();
    // Firestoreに登録済みの場合
    if (data) {
      // プレイリスト一覧を表示
      this.setState({
        playlists: await this.fetchPlayLists({ user: data }),
        isFetching: false,
        isLoaded: true,
      });
      // Firestoreに未登録の場合
    } else if (window.location.search) {
      // パラメータのauthorization-codeでプレイリスト一覧を表示
      const code: string = getQueryObject().code;
      this.setState({
        playlists: await this.fetchPlayLists({ code }),
        isFetching: false,
        isLoaded: true,
      });
    } else {
      // ログイン画面表示
      this.props.history.push('/login');
    }
  }

  onChangeHour(hour: string) {
    this.setState({ hour: hour });
  }

  onChangeMinute(minute: string) {
    this.setState({ minute: minute });
  }

  onChangePlaylist(index: number) {
    this.setState({ playlistUri: this.state.playlists[index].uri });
    this.changeTitle(index);
  }

  changeTitle(index: number) {
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

  async fetchPlayLists({ user = null, code = '' }) {
    const getPlaylists = firebase.functions().httpsCallable('getPlaylists');
    const result = await getPlaylists({ user, code });
    return result.data.items
      ? orderBy(result.data.items, ['name'], ['asc'])
      : [];
  }

  showComplete() {
    const timeline = anime.timeline();
    // ローディング消す
    timeline.add({
      targets: [this.$loader],
      scale: {
        value: [1, 0],
        duration: 200,
        easing: 'easeOutQuart',
      },
      complete: () => {
        if (this.$complete) this.$complete.style.display = 'block';
      },
    });
    // チェックマーク出す
    timeline.add({
      targets: [this.$complete],
      scale: {
        value: [0, 1],
        duration: 300,
        easing: 'cubicBezier(.3,1.04,.86,1.47)',
      },
    });
    // チェックマーク消す
    timeline.add({
      targets: [this.$complete],
      scale: {
        value: [1, 0],
        duration: 200,
        delay: 500,
        easing: 'easeOutQuart',
      },
      complete: () => {
        if (this.$loader) this.$loader.style.transform = '';
        if (this.$complete) this.$complete.style.display = 'none';
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
        <Title>{this.state.title}</Title>
        {this.state.isLoaded && (
          <Playlists
            playlists={this.state.playlists}
            onChangePlaylist={this.onChangePlaylist.bind(this)}
          />
        )}
        <SetButton onClick={this.setScheduler.bind(this)}>SET ALARM</SetButton>
        <Loading
          className="Loading"
          style={{ display: this.state.isFetching ? 'block' : 'none' }}
        >
          <Loader className="loader" ref={$el => (this.$loader = $el)} />
          <Complete ref={$el => (this.$complete = $el)}>
            <img src={check} alt="check" />
          </Complete>
        </Loading>
      </div>
    );
  }
}

export default withRouter(Main);

const Loading = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  z-index: 999;
`;

const Complete = styled.div`
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 70px;
  height: 70px;
  img {
    width: 100%;
  }
`;

const Loader = styled.div`
  color: #ffffff;
  font-size: 10px;
  margin: 45vh auto;
  position: relative;
  text-indent: -9999em;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: load7 1.8s infinite ease-in-out;
  animation: load7 1.8s infinite ease-in-out;
  &::before,
  &::after {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation: load7 1.8s infinite ease-in-out;
    animation: load7 1.8s infinite ease-in-out;
    content: '';
    position: absolute;
    top: 0;
  }
  &::before {
    left: -3.5em;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  &::after {
    left: 3.5em;
  }
  @-webkit-keyframes load7 {
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
  @keyframes load7 {
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
`;
const Title = styled.div`
  font-size: 25px;
  font-weight: bold;
  letter-spacing: 0;
  padding-bottom: 2vh;
`;
const SetButton = styled.div`
  background-color: #1db954;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  border-radius: 50px;
  width: 70%;
  padding: 10px 0;
  margin: 7vh auto;
`;
