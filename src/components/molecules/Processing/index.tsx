import React, { useEffect, useCallback, createRef } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import Loading from '../../atoms/Loading';
import Complete from '../../atoms/Complete';

interface Props {
  completed: boolean;
  hideComplete: () => void;
}

const Processing: React.FC<Props> = (props) => {
  const loading: React.RefObject<HTMLDivElement> = createRef();
  const complete: React.RefObject<HTMLDivElement> = createRef();

  const completingAnimation = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const $loading = loading.current;
      const $complete = complete.current;
      const timeline = anime.timeline();
      // shrink loading
      timeline.add({
        targets: [$loading],
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
  }, [complete, loading]);

  useEffect(() => {
    // アラーム設定処理完了後、アニメーション表示
    if (props.completed) {
      completingAnimation().then(() => {
        props.hideComplete();
      });
    }
  }, [completingAnimation, props]);

  return (
    <StyledLoading className="Processing">
      <Loading ref={loading} />
      <Complete ref={complete} display="none" />
    </StyledLoading>
  );
};

export default Processing;

const StyledLoading = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  z-index: 999;
`;
