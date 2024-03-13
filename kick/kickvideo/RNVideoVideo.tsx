import React, {useRef, forwardRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RNVideoVideoProps = {
  ref: React.RefObject<VideoRef>;
  watchUrl: string;
  startTime?: string;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  onProgress: (data: { currentTime: number }) => void;
  forwardRewind?: (time: number) => void;
  resumeTime?: string;
  uuid?: string;
  // onProgressFunc: (time: number) => void;
};

// const RNVideoVideo: React.FC<RNVideoVideoProps> = ({watchUrl, paused, setPaused, onProgress, resumeTime, uuid}) => {
const RNVideoVideo = forwardRef<VideoRef, RNVideoVideoProps>((props, ref) => {

  console.log('RNVIDEOVIDEO called');
  const { watchUrl, paused, onProgress, forwardRewind, resumeTime, uuid } = props;
  // const [currentTime, setCurrentTime] = useState(0);
// const [paused, setPaused] = useState(false);

  const videoRef = useRef<VideoRef>(null);
  const handleLoad = async () => {
    // if (resumeTime && videoRef.current) {
    //   const resumeTimeInt = parseInt(resumeTime); // get value without any decimal
    //   console.log('resumeTime', resumeTimeInt);
    //   videoRef.current.seek(resumeTimeInt);
    // }
    if (resumeTime && uuid) {
      // get data from async storage
      let resumeStr = '';
      try {
        resumeStr = await AsyncStorage.getItem(uuid) || '';
      } catch (e) {
        console.error('Error getting data from async storage', e);
      }
      
      if (resumeStr) {
        const resumeTimeInt = parseInt(resumeStr);
        if (videoRef.current) {
          videoRef.current.seek(resumeTimeInt);
        }
      }
    }
  }

  // fullscreen
  const [fullScreen, setFullScreen] = useState(false);

  // const forwardRewind = async (time: number) => {
  //   if (videoRef.current) {
  //     // @ts-ignore
  //     const currentTime = await videoRef.current.getCurrentTime();
  //     const newTime = currentTime + 10;
  //     videoRef.current.seek(newTime);
  //   }
  // }

  // useEffect(() => {
  //   // after 10 seconds seek to 2 minutes
  //   setTimeout(() => {
  //     if (videoRef.current) {
  //       videoRef.current.seek(120);
  //     }
  //   }, 10000);
  // }, []);

  // render
  return (
    <>
      <Video 
      // ref={videoRef}
      ref={ref}
      source={{uri: watchUrl}} 
      style={fullScreen? StyleSheet.absoluteFill : styles.rnStyle} 
      controls={true} 
      // resizeMode="contain" 
      fullscreen={fullScreen} 
      onFullscreenPlayerWillPresent={() => {
        setFullScreen(true);
      }}
      onFullscreenPlayerWillDismiss={() => {
        setFullScreen(false);
      }}
      paused={paused}
      // forwardRewind
      onProgress={onProgress} 
      onLoad={handleLoad}
      focusable={true}
      // onProgress={handleProgress} 
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

export default RNVideoVideo;