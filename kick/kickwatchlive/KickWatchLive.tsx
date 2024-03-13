/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { TVFocusGuideView, View, StyleSheet, Dimensions, Text, ScrollView, ActivityIndicator, Platform, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';

import { getApi } from '../services/Kickservice';
// import RNVideo from './RNVideo';
import { getKick7TvEmotesList } from '../services/KickChatService';
import { setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import RNVideo from './RNVideo';

interface RouteParams {
  username: string;
  kickProfile: any;
}

const KickWatchLive: React.FC = () => {
  // variables
  const route = useRoute();
  const { username } = route.params as RouteParams;
  const { kickProfile } = route.params as RouteParams;

  const [videoUrl, setVideoUrl] = useState('');

  // const [kickProfileState, setKickProfileState] = useState<any>(null);

  // chat stuffs
  const scrollViewRef = useRef<ScrollView>(null);
  // let scrollViewRef: any;
  // if (Platform.OS === 'web') {
  //   scrollViewRef = useFocusable();
  // } else {
  //   scrollViewRef = useRef<ScrollView>(null);
  // }
  const [autoScroll, setAutoScroll] = useState(true); // New state variable
  const [messages, setMessages] = React.useState<
    { message: string; username: string; color: string }[]
  >([]);
  const ws = useRef<WebSocket | null>(null);
  const [emoteDict, setEmoteDict] = React.useState<any>({});
  const emoteDictRef = useRef(emoteDict);

  // const chatDelay = 10000; // Delay in milliseconds

  // chat buttons test
  const [modalVisible, setModalVisible] = useState(false);
  const [chatDelay, setChatDelay] = useState(10000);
  const chatDelayRef = useRef(chatDelay);

  // chat buttons
  let mainBt1: any;
  let mainBt2: any;
  let mainBt3: any;
  let bt1: any; // back
  let bt2: any; // go back to kick homepage
  let bt3: any; // increase delay
  let bt4: any; // decrease delay
  let bt5: any; // pause resume video
  let bt6: any; // rewind
  let bt7: any; // forward
  let bt8: any; // fullscreen
  if (Platform.OS === 'web') {
    mainBt1 = useFocusable();
    mainBt2 = useFocusable();
    mainBt3 = useFocusable();
    bt1 = useFocusable();
    bt2 = useFocusable();
    bt3 = useFocusable();
    bt4 = useFocusable();
    bt5 = useFocusable();
    bt6 = useFocusable();
    bt7 = useFocusable();
    bt8 = useFocusable();

    useEffect(() => {
      if (mainBt1 && mainBt1.ref && mainBt1.ref.current) {
        mainBt1.ref.current.focus();
        setFocus(mainBt1.focusKey);
      }
    }, []);

    useEffect(() => {
      // when modal is open focus on bt1
      if (modalVisible) {
        if (bt1 && bt1.ref && bt1.ref.current) {
          console.log('bt1.ref.current', bt1.ref.current);
          bt1.ref.current.focus();
          setFocus(bt1.focusKey);
        }
      } else {
        if (mainBt1 && mainBt1.ref && mainBt1.ref.current) {
          mainBt1.ref.current.focus();
          setFocus(mainBt1.focusKey);
        }
      }
    }, [modalVisible]);

    useEffect(() => {
      if (mainBt1.focused) mainBt1.ref.current?.focus();
      else if (mainBt2.focused) mainBt2.ref.current?.focus();
      else if (mainBt3.focused) mainBt3.ref.current?.focus();
      else if (bt1.focused) { bt1.ref.current?.focus(); console.log('bt1 focused'); }
      else if (bt2.focused) bt2.ref.current?.focus();
      else if (bt3.focused) bt3.ref.current?.focus();
      else if (bt4.focused) bt4.ref.current?.focus();
      else if (bt5.focused) bt5.ref.current?.focus();
      else if (bt6.focused) bt6.ref.current?.focus();
      else if (bt7.focused) bt7.ref.current?.focus();
      else if (bt8.focused) bt8.ref.current?.focus();
    }, [mainBt1.focused, mainBt2.focused, mainBt3.focused, bt1.focused, bt2.focused, bt3.focused, bt4.focused, bt5.focused, bt6.focused, bt7.focused, bt8.focused]);

  } else {
    mainBt1 = useRef(null);
    mainBt2 = useRef(null);
    mainBt3 = useRef(null);
    bt1 = useRef(null);
    bt2 = useRef(null);
    bt3 = useRef(null);
    bt4 = useRef(null);
    bt5 = useRef(null);
    bt6 = useRef(null);
    bt7 = useRef(null);
    bt8 = useRef(null);
  }

  const [isFocusedMainBt1, setIsFocusedMainBt1] = useState(false);
  const handleFocusMainBt1 = () => setIsFocusedMainBt1(true);
  const handleBlurMainBt1 = () => setIsFocusedMainBt1(false);

  const [isFocusedMainBt2, setIsFocusedMainBt2] = useState(false);
  const handleFocusMainBt2 = () => setIsFocusedMainBt2(true);
  const handleBlurMainBt2 = () => setIsFocusedMainBt2(false);

  const [isFocusedMainBt3, setIsFocusedMainBt3] = useState(false);
  const handleFocusMainBt3 = () => setIsFocusedMainBt3(true);
  const handleBlurMainBt3 = () => setIsFocusedMainBt3(false);

  const [isFocusedBt1, setIsFocusedBt1] = useState(false);
  const handleFocusBt1 = () => setIsFocusedBt1(true);
  const handleBlurBt1 = () => setIsFocusedBt1(false);

  const [isFocusedBt2, setIsFocusedBt2] = useState(false);
  const handleFocusBt2 = () => setIsFocusedBt2(true);
  const handleBlurBt2 = () => setIsFocusedBt2(false);

  const [isFocusedBt3, setIsFocusedBt3] = useState(false);
  const handleFocusBt3 = () => setIsFocusedBt3(true);
  const handleBlurBt3 = () => setIsFocusedBt3(false);

  // modal buttons 
  const [isFocusedBt4, setIsFocusedBt4] = useState(false);
  const handleFocusBt4 = () => setIsFocusedBt4(true);
  const handleBlurBt4 = () => setIsFocusedBt4(false);

  const [isFocusedBt5, setIsFocusedBt5] = useState(false);
  const handleFocusBt5 = () => setIsFocusedBt5(true);
  const handleBlurBt5 = () => setIsFocusedBt5(false);

  const [isFocusedBt6, setIsFocusedBt6] = useState(false);
  const handleFocusBt6 = () => setIsFocusedBt6(true);
  const handleBlurBt6 = () => setIsFocusedBt6(false);

  const [isFocusedBt7, setIsFocusedBt7] = useState(false);
  const handleFocusBt7 = () => setIsFocusedBt7(true);
  const handleBlurBt7 = () => setIsFocusedBt7(false);

  const [isFocusedBt8, setIsFocusedBt8] = useState(false);
  const handleFocusBt8 = () => setIsFocusedBt8(true);
  const handleBlurBt8 = () => setIsFocusedBt8(false);

  const navigation = useNavigation();


  useEffect(() => {
    console.log('KickWatchLive username', username);
    if (kickProfile) {
      console.log('KickWatchLive kickprofile', kickProfile);
      // setKickProfileState(kickProfile);
      getWsChat(kickProfile.chatroom.id);
      setVideoUrl(kickProfile.playback_url);
      if (kickProfile.user_id) {
        const emoteDictLocal = getKick7TvEmotesList(kickProfile.user_id);
        setEmoteDict(emoteDictLocal);
      }
    } else {
      console.log('KickWatchLive kickprofile is null');
      getKickProfile();
    }

  }, []);

  useEffect(() => {
    emoteDictRef.current = emoteDict;
  }, [emoteDict]);


  const getKickProfile = async () => {
    console.log('START getKickProfile username', username);
    const data = await getApi(username);
    if (data) {
      // setKickProfileState(data);
      if (data.chatroom && data.chatroom.id) getWsChat(data.chatroom.id);
      if (data.playback_url) setVideoUrl(data.playback_url);
      if (data.user_id) {
        const emoteDictLocal = await getKick7TvEmotesList(data.user_id);
        setEmoteDict(emoteDictLocal);
      }
      console.log('videoUrl', videoUrl);
    } else {
      console.log('fail getApi');
    }
  }


  // //////////////// chat functions
  const getWsChat = (chatRoomId: any) => {
    console.log('getWsChat called');
    ws.current = new WebSocket(
      'wss://ws-us2.pusher.com/app/eb1d5f283081a78b932c?protocol=7&client=js&version=7.6.0&flash=false',
    );

    ws.current.onopen = () => {
      ws.current?.send(
        `{"event":"pusher:subscribe","data":{"auth":"","channel":"chatrooms.${chatRoomId}.v2"}}`,
      ); // send a message
    };

    ws.current.onmessage = e => {
      // a message was received
      let message = e.data;
      const data = JSON.parse(message);
      const event = data.event;
      // console.log('data: ', data);
      if (event === 'App\\Events\\ChatMessageEvent') {
        const dataData = JSON.parse(data.data);
        const messageContent = processMessage(dataData.content);
        // console.log('messageContent', messageContent);
        const senderUsername = dataData.sender.username;
        const senderUsernameColor = dataData.sender.identity.color;

        setTimeout(() => {
          // console.log(senderUsername, ': ', messageContent);
          setMessages(prevMessages => [
            ...prevMessages,
            {
              message: messageContent,
              username: senderUsername,
              color: senderUsernameColor,
            },
          ]);
        }, chatDelayRef.current);
      } else {
        console.log('else event: ', event);
      }
    };

    ws.current.onerror = (e: any) => {
      // an error occurred
      console.log('error', e.message);
    };

    ws.current.onclose = e => {
      // connection closed
      console.log('close', e.code, e.reason);
    };
  };

  const processMessage = (message: string) => {
    // segment message into words
    // console.log('processMessage message: ', message);
    let words: any = [];
    try {
      words = message.split(' ');
      // console.log('words: ', words);
    } catch (e) {
      console.log('MESSAGE ERROR', e);
      console.log(message);
      words = [];
    }
    // console.log('emotedict keys: ', Object.keys(emoteDict));
    let messageElements = words.map((word: string, index: number) => {
      if (word.startsWith('[emote:') && word.endsWith(']')) {
        const emoteId = words[index].split(':')[1];
        // const emoteName = words[index].split(':')[2].replace(']', '');
        const emoteUrl =
          'https://files.kick.com/emotes/' + emoteId + '/fullsize';
        return (
          <Image
            key={index}
            source={{ uri: emoteUrl }}
            style={styles.image}
          // animated
          />
        );
      } else if (emoteDictRef.current[word] !== undefined) {
        const emoteId = emoteDictRef.current[word][0];
        const animated = emoteDictRef.current[word][1];
        // if animated then use gif else use webp
        let url7tv = '';
        if (animated) {
          url7tv = 'https://cdn.7tv.app/emote/' + emoteId + '/1x.webp'; // 1x.gif
        } else {
          url7tv = 'https://cdn.7tv.app/emote/' + emoteId + '/1x.webp';
        }
        // const url7tv =
        //   'https://cdn.7tv.app/emote/' + emoteDict[word] + '/1x.gif';
        return (
          <Image key={index} source={{ uri: url7tv }} style={styles.image} />
          // <image key={index} href={url7tv} style={styles.image} />
          // <Text key={index} style={styles.chatText}>IMAGE</Text>
        );
      } else {
        return (
          <Text key={index} style={styles.chatText}>
            {word}{' '}
          </Text>
        );
      }
    });
    // console.log('messageElements: ', messageElements);
    return messageElements;
  };

  // unsubscribe from websocket chatroom when component unmounts
  useEffect(() => {
    return () => {
      console.log('closing websocket');
      if (ws.current) ws.current.close(
        1000,
        'closing',
      );
    };
  }, []);

  const toggleAutoScroll = () => {
    console.log('toggleAutoScroll called');
    setAutoScroll(!autoScroll);
  };

  // on new messge scroll to bottom and remove old messages
  useEffect(() => {
    if (autoScroll) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      // if (Platform.OS === 'web') {
      //   scrollViewRef.ref.current?.scrollToEnd({ animated: true });
      // } else {
      //   scrollViewRef.current?.scrollToEnd({ animated: true });
      // }
      // console.log('scrolling to bottom');
    }
    if (messages.length > 100) {
      setMessages(prevMessages => prevMessages.slice(50));
      console.log('messages.length > 1000');
    }
  }, [autoScroll, messages]);

  // video buttons
  const [videoPaused, setVideoPaused] = useState(false);

  useEffect(() => {
    console.log('chatDelay changed', chatDelay);
    chatDelayRef.current = chatDelay;
  }, [chatDelay]);

  // const { ref, destinations } = useFocusGuideDestinationRef();

  // end chat functions


  // /////////////// screen orientation
  const [orientation, setOrientation] = useState('PORTRAIT');
  const determineAndSetOrientation = () => {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;

    if (width < height) {
      setOrientation('PORTRAIT');
      console.log('PORTRAIT');
    } else {
      setOrientation('LANDSCAPE');
      console.log('LANDSCAPE');
    }
  };

  useEffect(() => {
    const removeOrientationChangeListener = Dimensions.addEventListener(
      'change',
      determineAndSetOrientation,
    );
    determineAndSetOrientation();

    return () => {
      removeOrientationChangeListener &&
        removeOrientationChangeListener.remove();
    };
  }, []);


  // adding forward rewind stuffs
  const rnVideoRef = useRef<any>(null);
  const seekEventNeeded = useRef(false);
  const seekTime = useRef(0);

  const handleForwardRewind = (time: number) => {
    console.log('handleForwardRewind called', time);
    if (rnVideoRef.current) {
      // const currentTime = rnVideoRef.current.currentTime;
      // console.log('currentTime: ', currentTime, 'time: ', time);
      // const newTime = currentTime + time;
      // rnVideoRef.current.seek(5000);
      seekEventNeeded.current = true;
      seekTime.current = time;
    } else {
      console.log('rnVideoRef.current is null');
      console.log('rnVideoRef: ', rnVideoRef);
    }
  }

  const handleProgress = (data: { currentTime: number }) => {
    if (seekEventNeeded.current) {
      console.log('seekEventNeeded called', data.currentTime);
      if (rnVideoRef.current) {
        // const currentTime = rnVideoRef.current.currentTime;
        if (seekTime.current === 0) {
          rnVideoRef.current.seek(0);
          seekEventNeeded.current = false;
        } else {
          const currentTime = data.currentTime;
          const newTime = currentTime + seekTime.current;
          rnVideoRef.current.seek(newTime);
          seekEventNeeded.current = false;
        }

      }
    }
  }

  // end screen orientation

  // test

  // const myTVEventHandler = (evt: any) => {
  //   console.log('myTVEventHandler', evt);
  // };

  // useTVEventHandler(myTVEventHandler);  // eslint-disable-line react-hooks/rules-of-hooks

  // video buttons
  const [paused, setPaused] = useState(false);



  return (
    <>
      {
        Platform.OS === 'web' ? <></> :
          <TVFocusGuideView
            destinations={[mainBt1.current, mainBt2.current, mainBt3.current]}
            autoFocus
            trapFocusDown
            trapFocusLeft
            trapFocusRight
            trapFocusUp
          ></TVFocusGuideView>
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ marginTop: 50, padding: 20, backgroundColor: 'black' }}>
          {/* close modal */}
          <TouchableOpacity
            ref={Platform.OS === 'web' ? bt1.ref : bt1}
            style={[styles.modalButton,
            {
              backgroundColor: isFocusedBt1 ? 'yellow' : 'green',
              borderColor: isFocusedBt1 ? 'red' : 'black'
            }]}
            onPress={() => { setModalVisible(false); }}
            onFocus={handleFocusBt1}
            onBlur={handleBlurBt1}
            activeOpacity={0.7}
          >
            <Text style={{ color: isFocusedBt1 ? 'white' : 'blue' }}>Back</Text>
          </TouchableOpacity>
          {/* go back to kick homepage */}
          <TouchableOpacity
            ref={Platform.OS === 'web' ? bt2.ref : bt2}
            style={[styles.modalButton,
            {
              backgroundColor: isFocusedBt2 ? 'yellow' : 'green',
              borderColor: isFocusedBt2 ? 'red' : 'black'
            }]}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
                setModalVisible(false);
              }
            }}
            onFocus={handleFocusBt2}
            onBlur={handleBlurBt2}
            activeOpacity={0.7}
          >
            <Text style={{ color: isFocusedBt2 ? 'white' : 'blue' }}>Go Back to Kick Homepage</Text>
          </TouchableOpacity>
          {/* forward rewind */}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            {/* first button is to increase chat delay by 1 second second button to decrease and third text is to show the current chat delay */}
            <TouchableOpacity
              ref={Platform.OS === 'web' ? bt6.ref : bt6}
              style={[styles.modalButton,
              {
                backgroundColor: isFocusedBt6 ? 'yellow' : 'green',
                borderColor: isFocusedBt6 ? 'red' : 'black'
              }]}
              onPress={() => {
                handleForwardRewind(0);
              }}
              onFocus={handleFocusBt6}
              onBlur={handleBlurBt6}
              activeOpacity={0.7}
            >
              <Text style={{ color: isFocusedBt6 ? 'white' : 'blue' }}>Rewind</Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={Platform.OS === 'web' ? bt7.ref : bt7}
              style={[styles.modalButton,
              {
                backgroundColor: isFocusedBt7 ? 'yellow' : 'green',
                borderColor: isFocusedBt7 ? 'red' : 'black'
              }]}
              onPress={() => {
                handleForwardRewind(5);
              }}
              onFocus={handleFocusBt7}
              onBlur={handleBlurBt7}
              activeOpacity={0.7}
            >
              <Text style={{ color: isFocusedBt7 ? 'white' : 'blue' }}>Forward</Text>
            </TouchableOpacity>
          </View>
          {/* increase decrease chat delay */}
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          >
            {/* first button is to increase chat delay by 1 second second button to decrease and third text is to show the current chat delay */}
            <TouchableOpacity
              ref={Platform.OS === 'web' ? bt3.ref : bt3}
              style={[styles.modalButton,
              {
                backgroundColor: isFocusedBt3 ? 'yellow' : 'green',
                borderColor: isFocusedBt3 ? 'red' : 'black'
              }]}
              onPress={() => { setChatDelay(chatDelay + 1000); }}
              onFocus={handleFocusBt3}
              onBlur={handleBlurBt3}
              activeOpacity={0.7}
            >
              <Text style={{ color: isFocusedBt3 ? 'white' : 'blue' }}>Increase delay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              ref={Platform.OS === 'web' ? bt4.ref : bt4}
              style={[styles.modalButton,
              {
                backgroundColor: isFocusedBt4 ? 'yellow' : 'green',
                borderColor: isFocusedBt4 ? 'red' : 'black'
              }]}
              onPress={() => { setChatDelay(chatDelay - 1000); }}
              onFocus={handleFocusBt4}
              onBlur={handleBlurBt4}
              activeOpacity={0.7}
            >
              <Text style={{ color: isFocusedBt4 ? 'white' : 'blue' }}>Decrease Delay</Text>
            </TouchableOpacity>
            <Text style={{ color: 'white' }}>{chatDelay / 1000} seconds</Text>
          </View>

          {/* pause resume video */}
          <TouchableOpacity
            ref={Platform.OS === 'web' ? bt5.ref : bt5}
            style={[styles.modalButton,
            {
              backgroundColor: isFocusedBt5 ? 'yellow' : 'green',
              borderColor: isFocusedBt5 ? 'red' : 'black'
            }]}
            onPress={() => {
              setPaused(!paused);
            }}
            onFocus={handleFocusBt5}
            onBlur={handleBlurBt5}
            activeOpacity={0.7}
          >
            <Text style={{ color: isFocusedBt5 ? 'white' : 'blue' }}>
              {paused ? "Resume Video" : "Pause Video"}
            </Text>
          </TouchableOpacity>

          {/* fullscreen */}
          <TouchableOpacity
            ref={Platform.OS === 'web' ? bt8.ref : bt8}
            style={[styles.modalButton,
            {
              backgroundColor: isFocusedBt8 ? 'yellow' : 'green',
              borderColor: isFocusedBt8 ? 'red' : 'black'
            }]}
            onPress={() => {
              if (rnVideoRef.current) {
                console.log('presentFullscreenPlayer called');
                // close modal
                setModalVisible(false);
                // first dismiss or make sure it is not in fullscreen
                // rnVideoRef.current.dismissFullscreenPlayer();
                rnVideoRef.current.presentFullscreenPlayer();
              }
            }}
            onFocus={handleFocusBt8}
            onBlur={handleBlurBt8}
            activeOpacity={0.7}
          >
            <Text style={{ color: isFocusedBt8 ? 'white' : 'blue' }}>Fullscreen</Text>
          </TouchableOpacity>

        </View>
      </Modal>
      <View // view for video and chat
        style={[
          styles.container,
          { flexDirection: orientation === 'LANDSCAPE' ? 'row' : 'column' },
        ]}>
        <View // view for video
          // onLayout={handleLayout}
          style={[
            styles.videoPlayer,
            {
              width:
                orientation === 'LANDSCAPE'
                  ? Dimensions.get('window').width * 0.75
                  : Dimensions.get('window').width,
              height:
                orientation === 'LANDSCAPE'
                  ? Dimensions.get('window').height
                  : Dimensions.get('window').width / 1.77,
            },
          ]}>
          {videoUrl ?
            // <RNVideo watchUrl={videoUrl} paused={paused} setPaused={setPaused} />
            <RNVideo
              ref={rnVideoRef}
              watchUrl={videoUrl}
              paused={paused}
              setPaused={setPaused}
              onProgress={handleProgress}

            />
            : <ActivityIndicator />}
        </View>
        {/* end video for video */}

        <View // view for chat
          style={[
            styles.chat,
            {
              width:
                orientation === 'LANDSCAPE'
                  ? Dimensions.get('window').width * 0.25
                  : Dimensions.get('window').width,
              height:
                orientation === 'LANDSCAPE'
                  ? Dimensions.get('window').height
                  : Dimensions.get('window').height,
              paddingBottom: orientation === 'LANDSCAPE' ? 30 : 270,
            },
          ]}>

          <View style={styles.chatButtons}>
            {/* all options modal */}

            {/* all options modal touchopacity */}
            <TouchableOpacity
              ref={Platform.OS === 'web' ? mainBt1.ref : mainBt1}
              style={[styles.pauseChatButton, {
                backgroundColor: isFocusedMainBt1 ? 'blue' : '#1a1a1a',
                borderColor: isFocusedMainBt1 ? 'red' : 'black',
              }]}
              onPress={() => { setModalVisible(true); }}
              onFocus={handleFocusMainBt1}
              onBlur={handleBlurMainBt1}
              activeOpacity={0.7}
            >
              <Text style={{ color: isFocusedMainBt1 ? 'white' : 'blue', fontSize: 16 }}>Options</Text>
            </TouchableOpacity>

            {/* other options */}
            {/* pause resume chat */}
            <TouchableOpacity
              ref={Platform.OS === 'web' ? mainBt2.ref : mainBt2}
              style={[styles.pauseChatButton, {
                backgroundColor: isFocusedMainBt2 ? 'blue' : '#1a1a1a',
                borderColor: isFocusedMainBt2 ? 'red' : 'black',
              }]}
              onPress={toggleAutoScroll}
              // onPress={() => { handleForwardRewind(5); }}
              onFocus={handleFocusMainBt2}
              onBlur={handleBlurMainBt2}
              activeOpacity={0.7}
            >
              <Text style={{ color: isFocusedMainBt2 ? 'white' : 'blue', fontSize: 16 }}>
                {autoScroll ? "Pause Chat" : "Resume Chat"}
              </Text>
            </TouchableOpacity>


            {/* pause resume video */}
            <TouchableOpacity
              ref={Platform.OS === 'web' ? mainBt3.ref : mainBt3}
              style={[styles.pauseChatButton, {
                backgroundColor: isFocusedMainBt3 ? 'blue' : '#1a1a1a',
                borderColor: isFocusedMainBt3 ? 'red' : 'black',
              }]}
              onPress={() => {
                setPaused(!paused);
                // handleForwardRewind(0);
              }}
              onFocus={handleFocusMainBt3}
              onBlur={handleBlurMainBt3}
              activeOpacity={0.7}
            >
              <Text style={{ color: isFocusedMainBt3 ? 'white' : 'blue', fontSize: 16 }}>
                {paused ? "Resume Vid" : "Pause Vid"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* chat */}
          <ScrollView
            ref={scrollViewRef}
            // onScroll={handleScroll}
            // scrollEventThrottle={50}
            contentContainerStyle={styles.messagesContainer}
            style={styles.messages}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}>
            {messages.map((message, index) => (
              <View key={index} style={styles.message}>
                <Text style={[styles.usernameStyle, { color: message.color }]}>
                  {message.username}
                  {': '}
                </Text>
                {message.message}
              </View>
            ))}
          </ScrollView>
        </View>
        {/* end view for chat */}
      </View>
    </>
  );
};

// Later on in your styles..
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  videoPlayer: {
    // flex: 1,
  },
  chat: {
    // paddingBottom: 300,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  ivplayerOpacity: {
    alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
  },
  rnStyle: {
    flex: 1
    // width: '100%',
    // height: '100%',
  },
  // chat
  image: { width: 20, height: 20 },
  chatText: {
    fontSize: 16, // set the font size
    color: 'white', // set the text color
    letterSpacing: 2,
    // margin: 5, // set the margin around the text
    // fontFamily: 'Arial', // set the font family
    // fontWeight: 'bold', // set the font weight
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  messages: {
    flex: 1,
    // Other styles...
  },
  message: {
    color: 'white',
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  usernameStyle: {
    fontWeight: 'bold',
  },

  pauseChatButton: {
    // position: 'absolute',
    // top: 0, // Position at the top of the container
    zIndex: 1,
    // // added
    // borderWidth: 1,
    // padding: 10,
    // margin: 10,
    // borderRadius: 10,
    // width: 200,
  },
  innerButton: {
    // backgroundColor: 'black', // Make the button black
    // paddingHorizontal: 10,
    // paddingVertical: 5,
  },
  innerButtonText: {
    color: 'white', // White text
  },
  chatButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },

  guide: {
    width: '100%',
    height: 200,
  },
  // modal chat buttons
  modalButton: {
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    // width: 200,
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
  },
});

export default KickWatchLive;
