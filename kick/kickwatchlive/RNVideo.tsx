import React, { forwardRef, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
// import {VideoTimeContext} from '../kickwatch/KickWatch';
// import {VideoTimeContext} from '../kickvideo/VideoTimeContext';

type RNVideoProps = {
  ref: React.RefObject<VideoRef>;
  watchUrl: string;
  startTime?: string;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  onProgress: (data: { currentTime: number }) => void;
  // onProgressFunc: (time: number) => void;
};

// const RNVideo: React.FC<RNVideoProps> = ({watchUrl, paused, setPaused}) => {
// make it forwardRef
const RNVideo = forwardRef<VideoRef, RNVideoProps>((props, ref) => {
  const counter = useRef(0);
  console.log('RNVIDEO called' + counter.current);
  counter.current += 1;

  const { watchUrl, paused, onProgress } = props;

  // fullscreen
  const [fullScreen, setFullScreen] = useState(false);

  // console.log('RNVIDEO called');
  // const [paused, setPaused] = useState(false);

  // render
  return (
    <>
      <Video
        ref={ref}
        source={{ uri: watchUrl }}
        style={fullScreen ? StyleSheet.absoluteFill : styles.rnStyle}
        controls={true}
        resizeMode="contain"
        fullscreen={fullScreen}
        paused={paused}
        onProgress={onProgress}
        onSeek={(data) => console.log('onSeek', data)}
        focusable={true}
        // onProgress={handleProgress} 
        onFullscreenPlayerWillPresent={() => {
          setFullScreen(true);
        }}
        onFullscreenPlayerWillDismiss={() => {
          setFullScreen(false);
        }}
      />
    </>
  );
}
)
  ;

const styles = StyleSheet.create({
  rnStyle: {
    width: '100%',
    height: '100%',
  },
});

export default RNVideo;
