import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import anime from 'animejs';
import check from 'src/images/baseline-check_circle_outline-24px.svg';

interface Props {
  completed: boolean;
  hideComplete: () => void;
}

const Loading: React.FC<Props> = (props) => {
  const loader = useRef<HTMLDivElement>(null);
  const complete = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // アラーム設定処理完了後、アニメーション表示
    if (props.completed) {
      completingAnimation().then(() => {
        props.hideComplete();
      });
    }
  }, [props]);

  const completingAnimation = (): Promise<void> => {
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
    <StyledLoading className="Loading">
      <Loader ref={loader} />
      <Complete ref={complete}>
        <img src={check} alt="check" />
      </Complete>
    </StyledLoading>
  );
};

export default Loading;

const StyledLoading = styled.div`
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
