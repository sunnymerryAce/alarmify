import anime from 'animejs';
import {
  getUserFromFirestore,
  getPlaylists,
  scheduleAlarm,
} from '../../plugins/firebase';
import { orderBy } from 'lodash-es';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Timer from '../../components/Timer';
import Playlists from '../../components/Playlists';
import getQueryParametersForIE11 from '../../util/functions/getQueryParametersForIE11';

interface Props extends RouteComponentProps {}

const check = require('../../images/baseline-check_circle_outline-24px.svg');

const Main: React.FC<Props> = (props) => {
  const [hour, setHour] = useState<string>('0');
  const [minute, setMinute] = useState<string>('0');
  const [playlists, setPlaylists] = useState<Array<any>>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loadingVisible, setLoadingVisible] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [completeVisible, setCompleteVisible] = useState<boolean>(false);

  const loader = useRef<HTMLDivElement>(null);
  const complete = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (completeVisible) {
      showComplete();
    }
  }, [completeVisible]);

  const initialize = async () => {
    // Firestoreの情報を参照
    const { data } = await getUserFromFirestore();
    // Firestoreに登録済みの場合
    if (data.ok && data.user.access_token) {
      // プレイリスト一覧を表示
      const playlists = await fetchPlayLists({ user: data.user });
      setPlaylists(playlists);
      setLoadingVisible(false);
      setIsInitialized(true);
      // Firestoreに未登録の場合
    } else if (window.location.search) {
      // パラメータのauthorization-codeでプレイリスト一覧を表示
      const code: string = getQueryParametersForIE11().code;
      const playlists = await fetchPlayLists({ code });
      setPlaylists(playlists);
      setLoadingVisible(false);
      setIsInitialized(true);
    } else {
      // ログイン画面表示
      props.history.push('/login');
    }
  };

  const fetchPlayLists = async ({ user = null, code = '' }) => {
    const { data } = await getPlaylists({ user, code });
    return data.ok && data.playlists.items
      ? orderBy(data.playlists.items, ['name'], ['asc'])
      : [];
  };

  const setScheduler = async () => {
    // ローディング表示
    setLoadingVisible(true);
    await scheduleAlarm({
      hour,
      minute,
      playlistUri: playlists[currentIndex].uri,
    }).catch((error) => {
      alert(error);
    });
    // チェックマークのアニメーション開始
    setCompleteVisible(true);
  };

  const showComplete = () => {
    const $loader = loader.current;
    const $complete = complete.current;
    const timeline = anime.timeline();
    // ローディング消す
    timeline.add({
      targets: [$loader],
      scale: {
        value: [1, 0],
        duration: 200,
        easing: 'easeOutQuart',
      },
      complete: () => {
        if ($complete) {
          anime.set($complete, {
            display: 'block',
          });
        }
      },
    });
    // チェックマーク出す
    timeline.add({
      targets: [$complete],
      scale: {
        value: [0, 1],
        duration: 300,
        easing: 'cubicBezier(.3,1.04,.86,1.47)',
      },
    });
    // チェックマーク消す
    timeline.add({
      targets: [$complete],
      scale: {
        value: [1, 0],
        duration: 200,
        delay: 500,
        easing: 'easeOutQuart',
      },
      complete: () => {
        if ($complete) {
          anime.set($complete, {
            display: 'none',
          });
        }
        setLoadingVisible(false);
        setCompleteVisible(false);
      },
    });
  };

  return (
    <div className="Main">
      <Timer
        onChangeHour={(hour: string) => {
          setHour(hour);
        }}
        onChangeMinute={(minute: string) => {
          setMinute(minute);
        }}
      />
      <Title>{playlists.length ? playlists[currentIndex].name : ''}</Title>
      {isInitialized && (
        <Playlists
          playlists={playlists}
          onChangePlaylist={(index: number) => {
            setCurrentIndex(index);
          }}
        />
      )}
      <SetButton onClick={setScheduler}>SET ALARM</SetButton>
      {loadingVisible && (
        <Loading className="Loading">
          <Loader ref={loader} className="loader" />
          <Complete ref={complete}>
            <img src={check} alt="check" />
          </Complete>
        </Loading>
      )}
    </div>
  );
};

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
