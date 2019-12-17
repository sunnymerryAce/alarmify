import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import anime from 'animejs';
import { orderBy } from 'lodash-es';
import {
  getUserFromFirestore,
  getPlaylists,
  scheduleAlarm,
} from '../../plugins/firebase';
import Timer from '../../components/Timer';
import Playlists from '../../components/Playlists';
import check from '../../images/baseline-check_circle_outline-24px.svg';
import { User, GetPlayListsParam, GetPlaylistsResponse } from '../../../types';

const retrieveUser = async (): Promise<User | undefined> => {
  const { data } = await getUserFromFirestore().catch(() => {
    return { data: {} };
  });
  const hasRegistered = data.ok && data.user.access_token;
  return hasRegistered ? data.user : undefined;
};

const fetchPlayLists = async (
  param: GetPlayListsParam,
): Promise<Array<SpotifyApi.PlaylistObjectSimplified>> => {
  const response: GetPlaylistsResponse = await getPlaylists(param).catch(() => {
    return {
      data: {
        ok: false,
      },
    };
  });
  return response.data.ok && response.data.playlists
    ? orderBy(response.data.playlists.items, ['name'], ['asc'])
    : [];
};

interface Props extends RouteComponentProps {}

const Main: React.FC<Props> = (props) => {
  const [playlists, setPlaylists] = useState<Array<any>>([]);
  const [hour, setHour] = useState<string>('0');
  const [minute, setMinute] = useState<string>('0');
  const [playlistUri, setPlaylistUri] = useState<string>('');
  const [loadingVisible, setLoadingVisible] = useState<boolean>(true);
  const [playlistsVisible, setPlaylistsVisible] = useState<boolean>(false);
  const [completeDialogVisible, setCompleteDialogVisible] = useState<boolean>(
    false,
  );
  const loader = useRef<HTMLDivElement>(null);
  const complete = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (completeDialogVisible) {
      animateCompleteDialog();
    }
  }, [completeDialogVisible]);

  const initialize = async () => {
    const user = await retrieveUser();
    const isLoggedInSpotify = user || /code/.test(window.location.search);
    if (isLoggedInSpotify) {
      const playlists: Array<SpotifyApi.PlaylistObjectSimplified> = await fetchPlayLists(
        {
          user,
          // 初回ログイン時、authorization codeでfetch
          code: user
            ? null
            : new URL(window.location.href).searchParams.get('code'),
        },
      );
      setPlaylists(playlists);
      setPlaylistsVisible(true);
      setLoadingVisible(false);
    } else {
      goToLoginPage();
    }
  };

  const animateCompleteDialog = async () => {
    await startCompleteDialogAnimation();
    setLoadingVisible(false);
    setCompleteDialogVisible(false);
  };

  const setScheduler = async () => {
    setLoadingVisible(true);
    await scheduleAlarm({
      hour,
      minute,
      playlistUri,
    }).catch((error) => {
      alert(error);
      setLoadingVisible(false);
    });
    setCompleteDialogVisible(true);
  };

  const goToLoginPage = () => {
    props.history.push('/login');
  };

  const startCompleteDialogAnimation = (): Promise<void> => {
    return new Promise((resolve) => {
      const $loader = loader.current;
      const $complete = complete.current;
      const timeline = anime.timeline();
      // shrink loading
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
      // popup check mark
      timeline.add({
        targets: [$complete],
        scale: {
          value: [0, 1],
          duration: 300,
          easing: 'cubicBezier(.3,1.04,.86,1.47)',
        },
      });
      // shrink check mark
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
          resolve();
        },
      });
    });
  };

  return (
    <div className="Main">
      <Timer setHour={setHour} setMinute={setMinute} />
      {playlistsVisible && (
        <Playlists playlists={playlists} setPlaylistUri={setPlaylistUri} />
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
