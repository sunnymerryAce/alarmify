import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { scheduleAlarm } from '../../../plugins/firebase';
import retrieveUser from '../../../plugins/firebase/retrieveUser';
import fetchPlaylists from '../../../plugins/firebase/fetchPlaylists';
import Timer from '../../molecules/Timer';
import Playlists from '../../molecules/Playlists';
import Processing from '../../molecules/Processing';
import Button from '../../atoms/Button';

const isLoggedInSpotify = (): boolean => {
  return /code/.test(window.location.search) as boolean;
};

const getPlayLists = async (
  user: User | null,
): Promise<Array<SpotifyApi.PlaylistObjectSimplified>> => {
  const param: Api.GetPlayListsParam = {
    user,
    // 初回ログイン時、authorization codeでfetch
    code: user ? null : new URL(window.location.href).searchParams.get('code'),
  };
  return await fetchPlaylists(param);
};

const Alarm: React.FC<RouteComponentProps> = (props) => {
  const [playlists, setPlaylists] = useState<
    Array<SpotifyApi.PlaylistObjectSimplified>
  >([]);
  const [hour, setHour] = useState<string>('0');
  const [minute, setMinute] = useState<string>('0');
  const [playlistUri, setPlaylistUri] = useState<string>('');
  const [loadingVisible, setLoadingVisible] = useState<boolean>(true);
  const [playlistsVisible, setPlaylistsVisible] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Top.tsxの方がいいのでは
    initialize();
    // 初期処理のため第二引数を指定しない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialize = async () => {
    const user: User | null = await retrieveUser();
    if (!user && !isLoggedInSpotify()) {
      goToLoginPage();
      return;
    }
    const playlists = await getPlayLists(user);
    setPlaylists(playlists);
    setPlaylistsVisible(true);
    setLoadingVisible(false);
  };

  const setScheduler = async () => {
    setLoadingVisible(true);
    scheduleAlarm({
      hour,
      minute,
      playlistUri,
    })
      .then(() => {
        showComplete();
      })
      .catch((error) => {
        showError(error);
      });
  };

  const showComplete = () => {
    setCompleted(true);
  };

  const hideComplete = () => {
    setLoadingVisible(false);
    setCompleted(false);
  };

  const showError = (error: string) => {
    setLoadingVisible(false);
    alert(error);
  };

  const goToLoginPage = () => {
    props.history.push('/login');
  };

  const onChangePlaylist = (index: number) => {
    setPlaylistUri(playlists[index] ? playlists[index].uri : '');
  };

  return (
    <div className="Alarm">
      <Timer setHour={setHour} setMinute={setMinute} />
      {playlistsVisible && (
        <Playlists playlists={playlists} onChangePlaylist={onChangePlaylist} />
      )}
      <Button onClick={setScheduler} text="SET ALARM"></Button>
      {loadingVisible && (
        <Processing completed={completed} hideComplete={hideComplete} />
      )}
    </div>
  );
};

export default Alarm;
