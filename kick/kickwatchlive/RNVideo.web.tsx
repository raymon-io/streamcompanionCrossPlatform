import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
// get video.js
import videojs from 'video.js';
// video.js css
import 'video.js/dist/video-js.css';

type RNVideoProps = {
  watchUrl: string;
  startTime?: string;
  // onProgressFunc: (time: number) => void;
};

const RNVideo: React.FC<RNVideoProps> = ({ watchUrl }) => {

  // videojs
  const videoRef = React.useRef(null);
  const options = {
    autoplay: true,
    controls: true,
    sources: [
      {
        src: watchUrl,
        type: 'application/x-mpegURL',
      },
    ],
    fill: true,
    techOrder: ['html5'],
    plugins: {
    },
    controlBar: {
      currentTimeDisplay: true,
      durationDisplay: true,
      remainingTimeDisplay: true,
      fullscreenToggle: true,
      seekToLive: true,
      volumePanel: {
        inline: false,
      },
      progressControl: {
        seekBar: true,
      },
    },
  };

  React.useEffect(() => {
    // create player
    let player: any;
    if (videoRef.current) {
      player = videojs(videoRef.current, options, function onPlayerReady() {
        console.log('onPlayerReady');
      });
    }

    // destroy player on unmount
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [watchUrl]);

  // render
  return (
    <>
      {/* <Text style={{color: 'white'}}>Web Video</Text> */}
      <video ref={videoRef} className="video-js vjs-big-play-centered" style={styles.rnStyle}
        playsInline={true}
        autoPlay={true}
        controls={true}
        preload='auto'
      />
    </>
  );
};

const styles = StyleSheet.create({
  rnStyle: {
    width: '100%',
    height: '100%',
  },
});

export default RNVideo;
