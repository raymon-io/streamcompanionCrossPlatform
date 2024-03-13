import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, TVFocusGuideView, TouchableOpacity, View, Text, Modal, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import RNVideoVideo from './RNVideoVideo';
import { setFocus, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { getKick7TvEmotesList } from '../services/KickChatService';

import AsyncStorage from '@react-native-async-storage/async-storage';

// import { Image } from 'react-native';
import { Image } from 'expo-image';
// import FastImage from 'react-native-fast-image';
// import BlastedImage from 'react-native-blasted-image';

interface RouteParams {
    // videoUrl: item.source,
    // startTime: item.start_time,
    // videoChannelId: item.channel_id,
    // streamerUseridVideo: streamerUserId,
    watchUrl: string;
    startTime?: string;
    // onProgressFunc: (time: number) => void;
    videoChannelId: string;
    streamerUseridVideo: string;
    uuid: string;
    streamerSlug: string;
    resumeTime?: string;
};

const KickVideoWatch = () => {
    const route = useRoute();
    const { watchUrl, startTime, videoChannelId, streamerUseridVideo, uuid, streamerSlug, resumeTime } = route.params as RouteParams;

    useEffect(() => {
        // console.log('KickVideoWatch watchUrl: ', watchUrl);
        console.log('watchUrl: ', watchUrl, 'startTime: ', startTime, 'videoChannelId: ', videoChannelId, 'streamerUseridVideo: ', streamerUseridVideo, 'resumeTime: ', resumeTime);
    }, []);


    const [paused, setPaused] = useState(false);

    // buttons , etc
    // chat buttons
    const [modalVisible, setModalVisible] = useState(false);
    const [chatDelay, setChatDelay] = useState(10000);

    let mainBt1: any;
    let mainBt2: any;
    let mainBt3: any;
    let bt1: any; // back
    let bt2: any; // go back to kick homepage
    let bt3: any; // increase chat delay
    let bt4: any; // decrease chat delay
    let bt5: any; // pause resume video
    let bt6: any; // rewind
    let bt7: any; // forward
    let bt8: any; // fullscreen
    let bt9: any;
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
        bt9 = useFocusable();

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
            else if (bt9.focused) bt9.ref.current?.focus();
        }, [mainBt1.focused, mainBt2.focused, mainBt3.focused, bt1.focused, bt2.focused, bt3.focused, bt4.focused, bt5.focused, bt6.focused, bt7.focused, bt8.focused, bt9.focused]);

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
        bt9 = useRef(null);
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

    const [isFocusedBt9, setIsFocusedBt9] = useState(false);
    const handleFocusBt9 = () => setIsFocusedBt9(true);
    const handleBlurBt9 = () => setIsFocusedBt9(false);

    const navigation = useNavigation();


    const scrollViewRef = useRef<ScrollView>(null);
    const [messages, setMessages] = useState<
        { message: string; username: string; color: string }[]
    >([]);
    const [autoScroll, setAutoScroll] = useState(true); // New state variable
    const toggleAutoScroll = () => {
        console.log('toggleAutoScroll called');
        setAutoScroll(!autoScroll);
    };


    // video forward rewind stuffs
    const rnVideoRef = useRef<any>();

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

    // messages

    const [emoteDict, setEmoteDict] = useState<any>({});
    const emoteDictRef = useRef(emoteDict);

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
                    // <BlastedImage key={index} source={{ uri: emoteUrl }} style={styles.image} />
                    // <Text key={index}>IMAGE</Text>
                );
            } else if (emoteDictRef.current[word] !== undefined) {
                const emoteId = emoteDictRef.current[word][0];
                const animated = emoteDictRef.current[word][1];
                // if animated then use gif else use webp
                let url7tv = '';
                if (animated) {
                    url7tv = 'https://cdn.7tv.app/emote/' + emoteId + '/1x.webp'; // gif
                } else {
                    url7tv = 'https://cdn.7tv.app/emote/' + emoteId + '/1x.webp'; //webp
                }
                // const url7tv =
                //   'https://cdn.7tv.app/emote/' + emoteDict[word] + '/1x.gif';
                return (
                    <Image key={index} source={{ uri: url7tv }} style={styles.image} />
                    // <image key={index} href={url7tv} style={styles.image} />
                    // <BlastedImage key={index} source={{ uri: url7tv }} style={styles.image} />
                    // <Text key={index} style={{color: 'white'}}>IMAGE</Text>
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

    const getMessages = async (epochStr: string) => {
        console.log('getMessages called');
        const url = `https://kick.com/api/v2/channels/${videoChannelId}/messages?start_time=${epochStr}&channel_id=${videoChannelId}`;
        const url2 = url; // replace with your own proxy url if CORS issue
        let response: any;
        try {
            response = await fetch(url);
        } catch (error) {
            console.log('getMessages fetch error: ', error);
        }
        let data: any;
        if (response.status === 200) {
            data = await response.json();
        } else {
            // run play
            if (response && response.status) {
                console.log('getMessages response.status: ', response.status, 'trying runplay');
            }
            let response2: any;
            try {
                response2 = await fetch(url2);
            } catch (error) {
                console.log('getMessages fetch error runplay: ', error);
            }
            if (response2 && response2.status === 200) {
                data = await response2.json();
            } else {
                console.log('getMessages runplay failed');
            }
        }
        if (data && data.data && data.data.messages) {
            console.log('setting groupsOfMessages');
            // setMessages(data.data.messages);
            setGroupsOfMessages(data.data.messages);
            // if (autoScroll) {
            //     scrollViewRef.current?.scrollToEnd({ animated: true });
            // }
        } else {
            console.log('getMessages no data', data);
        }
        // return data;
    }


    const [updateMessageInterval, setUpdateMessageInterval] = useState(4000);
    const dateStrtoEpochStr = (dateStr: string) => dateStr.replace(' ', 'T') + '.000Z';
    // same as toISOString
    // const epochStrToDateStr = (epochStr: string) => epochStr.replace('T', ' ').replace('.000Z', '');
    const [videoTimeState, setVideoTimeState] = useState(dateStrtoEpochStr(startTime!) || '');

    const handleProgress = (data: { currentTime: number }) => {
        const localVideoTime = new Date(dateStrtoEpochStr(startTime!));
        localVideoTime.setSeconds(localVideoTime.getSeconds() + data.currentTime); // update local video time

        const diff = localVideoTime.getTime() - new Date(videoTimeState).getTime();
        if (Math.abs(diff) > updateMessageInterval) {
            // console.log('diff: ', diff, 'localVideoTime: ', localVideoTime, 'videoTimeState: ', videoTimeState);
            console.log('\n\nsetting videotimestate');
            setVideoTimeState(localVideoTime.toISOString());
            // set video time 
            try {
                AsyncStorage.setItem(uuid, data.currentTime.toString());
            }
            catch (e) {
                console.log('AsyncStorage.setItem error: ', e);
            }
        }

        if (seekEventNeeded.current) {
            console.log('seekEventNeeded called');
            if (rnVideoRef.current) {
                // const currentTime = rnVideoRef.current.currentTime;
                const currentTime = data.currentTime;
                const newTime = currentTime + seekTime.current;
                rnVideoRef.current.seek(newTime);
                seekEventNeeded.current = false;
            }
        }
    }

    const [groupsOfMessages, setGroupsOfMessages] = useState<Array<any>>([]);;

    useEffect(() => {
        // console.log('groupsOfMessages');
        let messagesTosave: { message: any; username: any; color: any; }[] = [];
        for (let i of groupsOfMessages) {
            // console.log('i: ', i);
            const messageContent = processMessage(i.content);
            const senderUsername = i.sender.username;
            const senderUsernameColor = i.sender.identity.color;
            const newMessage = { message: messageContent, username: senderUsername, color: senderUsernameColor };
            // console.log('setting message');
            // setMessages((prevMessages) => [...prevMessages, newMessage]);
            messagesTosave.push(newMessage);
        }
        // setMessages(prevMessages => [...prevMessages, ...messagesTosave]);
        // setMessages(messagesTosave);
        if (messagesTosave.length > 0) {
            console.log('setting message');
            setMessages(prevMessages => [...prevMessages, ...messagesTosave]);
            // setMessages(messagesTosave);
        }
    }, [groupsOfMessages]);

    // on new messge scroll to bottom and remove old messages
    useEffect(() => {
        if (autoScroll) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
        if (messages.length > 100) {
            setMessages(prevMessages => prevMessages.slice(50));
            console.log('messages.length > 50 length: ', messages.length);
        }
    }, [autoScroll, messages]);

    useEffect(() => {
        console.log('videoTimeState: ', videoTimeState);
        // get messages
        getMessages(videoTimeState);
        // try {
        //     AsyncStorage.setItem(uuid, videoTimeState);
        // }
        // catch (e) {
        //     console.log('AsyncStorage.setItem error: ', e);
        // }
    }, [videoTimeState]);

    useEffect(() => {
        // first time run get messages
        const epochStr = dateStrtoEpochStr(startTime!);
        getMessages(epochStr);
        // also get 7tv emotes
        const get7tvEmotes = async () => {
            const emoteDictLocal = await getKick7TvEmotesList(streamerUseridVideo);
            console.log('setting emoteDict');
            setEmoteDict(emoteDictLocal);
            emoteDictRef.current = emoteDictLocal;
        }
        get7tvEmotes();
    }, []);

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
    // end screen orientation

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
                            ref={Platform.OS === 'web' ? bt6.ref : bt6}
                            style={[styles.modalButton,
                            {
                                backgroundColor: isFocusedBt6 ? 'yellow' : 'green',
                                borderColor: isFocusedBt6 ? 'red' : 'black'
                            }]}
                            onPress={() => {
                                handleForwardRewind(-5);
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
                    {/* <View
                        style={{
                            marginTop: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                        }}
                    >
                       
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
                        >
                            <Text style={{ color: isFocusedBt4 ? 'white' : 'blue' }}>Decrease Delay</Text>
                        </TouchableOpacity>
                        <Text style={{ color: 'white' }}>{chatDelay / 1000} seconds</Text>
                    </View> */}

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
                    {watchUrl ?
                        <RNVideoVideo ref={rnVideoRef} watchUrl={watchUrl} paused={paused} setPaused={setPaused} onProgress={handleProgress} resumeTime={resumeTime} uuid={uuid} forwardRewind={handleForwardRewind} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    videoPlayer: {
        backgroundColor: 'black',
    },
    chat: {
        backgroundColor: 'black',
    },
    chatButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    pauseChatButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    messagesContainer: {
        padding: 10,
    },
    messages: {
        backgroundColor: 'black',
    },
    message: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    usernameStyle: {
        fontWeight: 'bold',
    },
    modalButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    // chat stuffs
    image: { width: 20, height: 20 },
    chatText: {
        fontSize: 16, // set the font size
        color: 'white', // set the text color
        letterSpacing: 2,
        // margin: 5, // set the margin around the text
        // fontFamily: 'Arial', // set the font family
        // fontWeight: 'bold', // set the font weight
    },
});

export default KickVideoWatch;

