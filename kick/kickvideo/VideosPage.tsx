import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform, TVFocusGuideView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import { KickVideoInterface } from '../interfaces/Kickinterface';
import { getApi } from '../services/Kickservice';

import AsyncStorage from '@react-native-async-storage/async-storage';

type VideosPageRouteProp = RouteProp<
    { Videos: { streamerSlug: string } },
    'Videos'
>;

const VideosPage = () => {
    //   const route = useRoute();
    //   const streamerSlug = route.params.streamerSlug;
    const route = useRoute<VideosPageRouteProp>();
    const { streamerSlug } = route.params;
    const [videos, setVideos] = useState<any>([]);
    const [noVideos, setNoVideos] = useState(false);
    // const [selectedQuality, setSelectedQuality] = useState('auto');
    // const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const navigation = useNavigation();

    const [streamerUserId, setStreamerUserId] = useState('');

    // back
    const [backFocus, setBackFocus] = useState<boolean>(false);
    const button1 = useRef(null);

    useEffect(() => {
        getVideos();
        getStreamerUserId(streamerSlug);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // read asyncstorage videoTimeState
        const readAsyncStorage = async () => {
            try {
                // const value = await AsyncStorage.getItem(streamerSlug);
                // if (value !== null) {
                //     console.log('readAsyncStorage value: ', value);
                // } else {
                //     console.log('readAsyncStorage value is null');
                // }
                // get all the keys and values
                const keys = await AsyncStorage.getAllKeys();
                console.log('readAsyncStorage keys: ', keys);
                const values = await AsyncStorage.multiGet(keys);
                console.log('readAsyncStorage values: ', values);
            } catch (e) {
                console.log('readAsyncStorage error: ', e);
                // error reading value
            }
        };
        readAsyncStorage();
        console.log('useEffect readAsyncStorage');
    }, []);


    const getStreamerUserId = async (searchUsername: string) => {
        // use getApi
        const response = await getApi(searchUsername);
        // from response get playback_url
        const streamer_user_id = response?.user_id;
        console.log('getStreamerUserId streamer_user_id: ', streamer_user_id);
        setStreamerUserId(streamer_user_id?.toString() || '');
    };

    const getVideos = async () => {
        console.log('streamerSlug: ', streamerSlug);
        const url = `https://kick.com/api/v2/channels/${streamerSlug}/videos`;
        const url2 = url; // use a proxy url to avoid CORS issues
        let response;
        try {
            response = await fetch(url);
        } catch (error) {
            console.log('getVideos fetch error: ', error);
        }
        // const response = await fetch(url);
        let data;
        if (response && response.status == 200) {
            console.log('getVideos fetch success');
            data = await response.json();
        } else {
            console.log('getVideos fetch error. trying runplay');
            let response2;
            try {
                response2 = await fetch(url2);
            } catch (error) {
                console.log('getVideos runplay fetch error: ', error);
            }
            if (response2 && response2.status === 200) {
                console.log('getVideos runplay fetch success');
                data = await response2.json();
            } else {
                console.log('getVideos runplay fetch error');
            }
        }
        // const data = await response.json();
        // console.log('data: ', data);
        // setVideos(data);
        if (data) {
            // setVideos(data);
            for (let i of data) {
                // i.durationString = new Date(i.duration * 1000).toISOString().substr(11, 8);
                // read all the data from ayncstorage uuid and set videoTime
                try {
                    const value = await AsyncStorage.getItem(i.video.uuid);
                    if (value !== null) {
                        console.log('getVideos value: ', value);
                        i.videoTime = value;
                    } else {
                        console.log('getVideos value is null');
                    }
                } catch (e) {
                    console.log('getVideos error: ', e);
                    // error reading value
                }
            }
            setVideos(data);
        }
        if (data.length === 0) {
            setNoVideos(true);
        }
    };

    const [focused, setFocused] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [focusedWatch, setFocusedWatch] = useState(new Array(videos.length).fill(false));
    const [focusedResume, setFocusedResume] = useState(new Array(videos.length).fill(false));


    // const renderVideo = ({ item }: { item: KickVideoInterface }) => (
    //     <View style={styles.container}>
    //         <Image source={{ uri: item.thumbnail.src }} style={styles.image} />
    //         <Text style={styles.text}>{item.session_title}</Text>
    //         <Text style={styles.text}>Views: {item.views}</Text>
    //         <Text style={styles.text}>Duration: {item.durationString}</Text>
    //         <Text style={styles.text}>Start Time: {item.start_time}</Text>
    //         {item.videoTime && <Text style={styles.text}>Video Time: {item.videoTime}</Text>}
    //         <Text style={styles.text}>
    //             Categories: {item.categories.map(category => category.name).join(', ')}
    //         </Text>
    //         <View style={styles.buttonContainer}>
    //             <TouchableOpacity
    //                 // style={[styles.button, focused ? styles.focusedStyle : styles.blurredStyle]}
    //                 style={focused ? styles.focusedButton : styles.blurredButton}
    //                 onPress={() =>
    //                     // @ts-ignore
    //                     navigation.navigate('KickVideoWatch', {
    //                         watchUrl: item.source,
    //                         startTime: item.start_time,
    //                         videoChannelId: item.channel_id,
    //                         streamerUseridVideo: streamerUserId,
    //                         uuid: item.video.uuid,
    //                         streamerSlug: streamerSlug,
    //                     })
    //                 }
    //                 onFocus={() => setFocused(true)}
    //                 onBlur={() => setFocused(false)}
    //             >
    //                 <Text style={focused ? styles.focusedText : styles.blurredText}>Watch</Text>
    //             </TouchableOpacity>
    //             {item.videoTime && (
    //                 <TouchableOpacity
    //                     style={[{ marginLeft: 15 }, focused2 ? styles.focusedButton2 : styles.blurredButton2]}
    //                     onPress={() =>
    //                         // @ts-ignore
    //                         navigation.navigate('KickVideoWatch', {
    //                             watchUrl: item.source,
    //                             startTime: item.start_time,
    //                             videoChannelId: item.channel_id,
    //                             streamerUseridVideo: streamerUserId,
    //                             uuid: item.video.uuid,
    //                             streamerSlug: streamerSlug,
    //                         })
    //                     }
    //                     onFocus={() => setFocused2(true)}
    //                     onBlur={() => setFocused2(false)}
    //                 >
    //                     <Text style={focused2 ? styles.focusedText2 : styles.blurredText2}>Resume Video</Text>
    //                 </TouchableOpacity>
    //             )}
    //         </View>
    //         {/* {videoUrl && <Video source={{uri: videoUrl}} />} */}
    //     </View>
    // );

    // const downloadVideo = (item: KickVideoInterface) => {
    //   // Implement download functionality here
    //   console.log('downloadVideo: ', item);
    // };

    return (
        <>
            {
                Platform.OS === 'web' ? <></> :
                    <TVFocusGuideView
                        destinations={[button1.current]}
                        autoFocus
                        trapFocusDown={false}
                        trapFocusUp={false}
                        trapFocusLeft={false}
                        trapFocusRight={false}
                    ></TVFocusGuideView>
            }
            <View style={styles.container}>
            <TouchableOpacity
                ref={button1}
                style={[styles.button, backFocus ? styles.buttonFocused : styles.buttonNotFocused]}
                // @ts-ignore
                onPress={() => navigation.goBack()}
                onFocus={() => setBackFocus(true)}
                onBlur={() => setBackFocus(false)}
            >
                <Text style={[styles.buttonText, backFocus ? styles.buttonTextFocused : styles.buttonTextNotFocused]}>Back</Text>
            </TouchableOpacity>
            <ScrollView style={{ borderColor: 'black' }}>
                {(videos && videos.length > 0) ? videos.map((item: any, index: any) => (
                    <View key={index} style={styles.container}>
                        <Image source={{ uri: item.thumbnail.src }} style={styles.image} />
                        <Text style={styles.text}>{item.session_title}</Text>
                        <Text style={styles.text}>Views: {item.views}</Text>
                        <Text style={styles.text}>Duration: {item.durationString}</Text>
                        <Text style={styles.text}>Start Time: {item.start_time}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={focusedWatch[index] ? styles.focusedButton : styles.blurredButton}
                                onPress={() =>
                                    // @ts-ignore
                                    navigation.navigate('KickVideoWatch', {
                                        watchUrl: item.source,
                                        startTime: item.start_time,
                                        videoChannelId: item.channel_id,
                                        streamerUseridVideo: streamerUserId,
                                        uuid: item.video.uuid,
                                        streamerSlug: streamerSlug,
                                    })}
                                onFocus={() => {
                                    const newFocused = [...focusedWatch];
                                    newFocused[index] = true;
                                    setFocusedWatch(newFocused);
                                }}
                                onBlur={() => {
                                    const newFocused = [...focusedWatch];
                                    newFocused[index] = false;
                                    setFocusedWatch(newFocused);
                                }}
                            >
                                <Text style={focusedWatch[index] ? styles.focusedText : styles.blurredText}>Watch</Text>
                            </TouchableOpacity>
                            {item.videoTime && (
                                <TouchableOpacity
                                    style={[{ marginLeft: 10 }, focusedResume[index] ? styles.focusedButton2 : styles.blurredButton2]}
                                    onPress={() =>
                                        // @ts-ignore
                                        navigation.navigate('KickVideoWatch', {
                                            watchUrl: item.source,
                                            startTime: item.start_time,
                                            videoChannelId: item.channel_id,
                                            streamerUseridVideo: streamerUserId,
                                            uuid: item.video.uuid,
                                            streamerSlug: streamerSlug,
                                            resumeTime: item.videoTime,
                                        })
                                    }
                                    onFocus={() => {
                                        const newFocused = [...focusedResume];
                                        newFocused[index] = true;
                                        setFocusedResume(newFocused);
                                    }}
                                    onBlur={() => {
                                        const newFocused = [...focusedResume];
                                        newFocused[index] = false;
                                        setFocusedResume(newFocused);
                                    }}
                                >
                                    <Text style={focusedResume[index] ? styles.focusedText2 : styles.blurredText2}>Resume Video</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )) :
                    (
                        noVideos ? <View style={{ alignItems: 'center', alignContent: 'center' }}><Text style={styles.text}>No videos found</Text></View> : <ActivityIndicator />
                    )
                }
            </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000', // Dark background
    },
    text: {
        color: '#fff', // Light text
    },
    image: {
        width: '100%', // Full width
        height: 200, // Fixed height
        resizeMode: 'cover', // Cover the whole area
    },
    // button: {
    //     backgroundColor: 'black', // dark grayish color
    //     // padding: 12,
    //     borderRadius: 8,
    //     marginRight: 8,
    //     // alignItems: 'center',
    // },
    button: {
        backgroundColor: 'black', // dark grayish color
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
      },
      buttonFocused: {
        backgroundColor: 'blue', // color when button is focused
      },
      buttonNotFocused: {
        backgroundColor: 'black', // color when button is not focused
      },
      buttonText: {
        // color: 'white',
        // textAlign: 'center',
        color: 'white', // Makes the button text white
        fontWeight: 'bold', // Makes the button text bold
      },
      buttonTextFocused: {
        color: 'yellow', // Makes the button text black when focused
      },
      buttonTextNotFocused: {
        color: 'white',
      },
    buttonContainer: {
        flexDirection: 'row', // to align buttons horizontally
        justifyContent: 'center', // to create space between buttons
        padding: 10, // to create space around buttons
    },
    focusedButton: {
        backgroundColor: '#007BFF', // blue
        padding: 10,
        borderRadius: 5,
    },
    blurredButton: {
        backgroundColor: '#6c757d', // gray
        padding: 10,
        borderRadius: 5,
    },
    focusedText: {
        color: 'yellow',
        textAlign: 'center',
        fontSize: 16,
    },
    blurredText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    focusedButton2: {
        backgroundColor: '#007BFF', // green
        padding: 10,
        borderRadius: 5,
    },
    blurredButton2: {
        backgroundColor: '#6c757d', // gray
        padding: 10,
        borderRadius: 5,
    },
    focusedText2: {
        color: 'yellow',
        textAlign: 'center',
        fontSize: 16,
    },
    blurredText2: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default VideosPage;
