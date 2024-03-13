import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TVEventHandler,
  HWEvent,
  // Button,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// import GoogleCast,  { CastButton, useCastState, useRemoteMediaClient } from 'react-native-google-cast';

import { useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type KickProfileProps = {
  streamer: any;
  // innerRef: RefObject<any>[];
  setupFocus?: boolean;
  inCollection?: boolean;
};

// const KickProfile: React.FC<KickProfileProps> = ({streamer}) => {
// const KickProfile = forwardRef<RefObject<any>[], KickProfileProps>(({ streamer, ...props }, ref) => {
const KickProfile = ({ streamer, setupFocus, inCollection }: KickProfileProps) => {
  // variables
  let button1: any; // button 1 is for watch
  let button2: any;
  let button3: any;
  let button4: any; // button 4 is for videos if live not available
  let button5: any;
  let button6: any; // added for add to collection to offline
  // if (Array.isArray(innerRef)) {
  //   // console.log('innerRef is an array');
  //   // console.log(innerRef[0]);
  //   // button1 = innerRef[0]
  //   // button2 = innerRef[1];
  //   // button3 = innerRef[2];
  // }

  if (Platform.OS !== 'web') {
    button1 = React.createRef();
    button2 = React.createRef();
    button3 = React.createRef();
    button4 = React.createRef();
    button5 = React.createRef();
    button6 = React.createRef();
  } else {
    button1 = useFocusable();
    button2 = useFocusable();
    button3 = useFocusable();
    button4 = useFocusable();
    button5 = useFocusable();
    button6 = useFocusable();

    // Listen for changes in focus
    useEffect(() => {
      if (button1.focused) {
        button1.ref.current?.focus();
        // setCurrentFocusedKeyonFocus(button1.focusKey);
      } else if (button2.focused) {
        button2.ref.current?.focus();
      } else if (button3.focused) {
        button3.ref.current?.focus();
      } else if (button4.focused) {
        button4.ref.current?.focus();
      } else if (button5.focused) {
        button5.ref.current?.focus();
      } else if (button6.focused) {
        button6.ref.current?.focus();
      }
    }, [button1.focused, button2.focused, button3.focused, button4.focused, button5.focused, button6.focused]);

    if (setupFocus) {
      useEffect(() => {
        // old focus
        // if (button1 && button1.current) {
        //   button1.current.focus();
        // }
        if (button4 && button4.ref && button4.ref.current) {
          button4.ref.current.focus();
          setFocus(button4.focusKey);
        } else if (button1 && button1.ref && button1.ref.current) {
          button1.ref.current.focus();
          setFocus(button1.focusKey);
        }
      }, []);
    }
  }

  // const refArray = [ref[0], ref[1], ref[2]];
  const navigation = useNavigation();
  const profilePic =
    streamer.user.profile_pic || streamer.user.profilePic || '';
  const followersCount =
    streamer.followers_count || streamer.followersCount || 0;

  const [isFocused, setIsFocused] = useState(false);

  const isFocusedRef = useRef(isFocused);
  const handleFocus = () => {
    setIsFocused(true);
    isFocusedRef.current = true;
    enableTVEventHandler();
  };
  const handleBlur = () => {
    setIsFocused(false);
    isFocusedRef.current = false;
    disableTVEventHandler();
  };

  const [isFocused2, setIsFocused2] = useState(false);
  const handleFocus2 = () => setIsFocused2(true);
  const handleBlur2 = () => setIsFocused2(false);

  const [isFocused3, setIsFocused3] = useState(false);
  const handleFocus3 = () => setIsFocused3(true);
  const handleBlur3 = () => setIsFocused3(false);

  const [isFocused4, setIsFocused4] = useState(false);
  const handleFocus4 = () => setIsFocused4(true);
  const handleBlur4 = () => setIsFocused4(false);

  const [isFocused5, setIsFocused5] = useState(false);
  const handleFocus5 = () => setIsFocused5(true);
  const handleBlur5 = () => setIsFocused5(false);

  const [isFocused6, setIsFocused6] = useState(false);
  const handleFocus6 = () => setIsFocused6(true);
  const handleBlur6 = () => setIsFocused6(false);

  // const client = useRemoteMediaClient();

  // const castVideo = () => {
  //   console.log(streamer.playback_url);
  //   const castState = useCastState();
  //   GoogleCast.showCastDialog();

  //   if (client) {
  //     client.loadMedia({
  //       mediaInfo: {
  //         contentUrl: streamer.playback_url,
  //         contentType: 'application/x-mpegURL',
  //       },
  //     });
  //   }
  // };

  // const MyCastComponent = () => {
  //   const client = useRemoteMediaClient();
  //   if (client) {
  //     // Send the media to your Cast device as soon as we connect to a device
  //     // (though you'll probably want to call this later once user clicks on a video or something)
  //     client.loadMedia({
  //       mediaInfo: {
  //         contentUrl:
  //           streamer.playback_url || '',
  //         contentType: 'application/x-mpegURL',
  //       },
  //     })
  //   }
  //   return <CastButton style={{ width: 24, height: 24 }} />;
  // }


  // const button1 = React.useRef(null);

  const handleWatchPress = () => {
    // @ts-ignore
    navigation.navigate('KickWatchLive', { username: streamer.slug });
    disableTVEventHandler();

  };

  const handleVideosPress = () => {
    console.log(streamer.slug);
    // @ts-ignore
    navigation.navigate('Videos', { streamerSlug: streamer.slug });
  };

  const handleOpenInKickPress = () => {
    Linking.openURL(`https://kick.com/${streamer.slug}`);
  };

  const handleAddToCollectionPress = async () => {
    console.log('add to collection');
    try {
      // Get the existing collection
      const jsonValue = await AsyncStorage.getItem('collection');
      let collection = null;
      if (jsonValue != null) {
        // Parse the string into an array
        collection = JSON.parse(jsonValue);
      } else {
        // If the collection doesn't exist, initialize it as an empty array
        collection = [];
      }

      // Check if streamer.slug already exists in the collection
      if (!collection.includes(streamer.slug)) {
        // Add the new value to the collection
        collection.push(streamer.slug);

        // Convert the updated collection back into a string
        const updatedJsonValue = JSON.stringify(collection);

        // Store the updated string back into AsyncStorage
        await AsyncStorage.setItem('collection', updatedJsonValue);
      }
    } catch (e) {
      // Handle error
      console.error(e);
    }

    // test just read the collection
    try {
      const jsonValue = await AsyncStorage.getItem('collection');
      console.log('collection', jsonValue);
    } catch (e) {
      // error reading value
      console.error(e);
    }
  }

  const handleDeleteFromCollectionPress = async () => {
    console.log('delete from collection');
    try {
      // Get the existing collection
      const jsonValue = await AsyncStorage.getItem('collection');
      let collection = null;
      if (jsonValue != null) {
        // Parse the string into an array
        collection = JSON.parse(jsonValue);
      } else {
        // If the collection doesn't exist, initialize it as an empty array
        collection = [];
      }

      // Check if streamer.slug already exists in the collection
      if (collection.includes(streamer.slug)) {
        // Add the new value to the collection
        collection = collection.filter((item: string) => item !== streamer.slug);

        // Convert the updated collection back into a string
        const updatedJsonValue = JSON.stringify(collection);

        // Store the updated string back into AsyncStorage
        await AsyncStorage.setItem('collection', updatedJsonValue);
      }
    } catch (e) {
      // Handle error
      console.error(e);
    }

    // test just read the collection
    try {
      const jsonValue = await AsyncStorage.getItem('collection');
      console.log('collection', jsonValue);
    } catch (e) {
      // error reading value
      console.error(e);
    }
  }

  // useEffect(() => {
  //   // @ts-ignore
  //   button1.current.focus();
  // }, []);

  // tv remote control 
  const route = useRoute();
  let localtvEventHandler: TVEventHandler;

  const enableTVEventHandler = () => {
    localtvEventHandler = new TVEventHandler();
    console.log('streamer is ', streamer.slug);
    localtvEventHandler.enable(undefined, function (component: React.Component, evt: HWEvent) {
      if (evt) {
        console.log(' kickprofile ', streamer.slug, ' evt.eventType is ', evt.eventType, ' isFocused is ', isFocusedRef.current);
        if (evt.eventType === 'select' && isFocusedRef.current && route.name === 'KickHome') {
          console.log('select event');
          handleWatchPress();
        }
      }
    });
  };

  const disableTVEventHandler = () => {
    console.log('disableTVEventHandler for streamer', streamer.slug);
    if (localtvEventHandler) {
      localtvEventHandler.disable();
      // localtvEventHandler = null;
    }
  };

  useEffect(() => {
    // Disable the TV event handler when the component unmounts
    return disableTVEventHandler;
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.profileContainer}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
            // <img src={profilePic} style={styles.profileImage} />
          ) : (
            <Image
              source={require('./images/defaultPic.png')}
              style={styles.profileImage}
            />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.verifiedAndName}>
            <Text style={styles.username}>{streamer.user.username}</Text>
          </View>
          {followersCount ? (
            <View style={styles.statsContainer}>
              <Text style={styles.followers}>{followersCount} Followers</Text>
            </View>
          ) : <></>}
          {streamer.livestream?.is_live || streamer.is_live ? (
            <View style={styles.liveContainer}>
              {/* <MyCastComponent /> */}
              {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title="Cast Video" onPress={castVideo} />
              </View> */}
              <Text style={styles.liveText}>Live Now!</Text>
              <View style={styles.viewerContainer}>
                <Text style={styles.viewerCount}>
                  {streamer.livestream?.viewer_count} Viewers
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                {/* watch  */}
                <TouchableOpacity
                  // ref={button1}
                  // ref={ref[0]}
                  // ref={button1}
                  ref={Platform.OS === 'web' ? button1.ref : button1}
                  style={[
                    styles.button,
                    isFocused ? styles.buttonFocused : styles.buttonNotFocused,
                  ]}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onPress={handleWatchPress}
                  activeOpacity={0.7}
                  >
                  <Text
                    style={[
                      styles.buttonText,
                      isFocused ? styles.buttonTextFocused : styles.buttonText,
                    ]}>
                    Watch
                  </Text>
                </TouchableOpacity>

                {/* videos */}
                <TouchableOpacity
                  // ref={ref[1]}
                  // ref={button2}
                  ref={Platform.OS === 'web' ? button2.ref : button2}
                  style={[
                    styles.button,
                    isFocused2 ? styles.buttonFocused : styles.buttonNotFocused,
                  ]}
                  onFocus={handleFocus2}
                  onBlur={handleBlur2}
                  onPress={handleVideosPress}
                  activeOpacity={0.7}
                  >
                  <Text
                    style={[
                      styles.buttonText,
                      isFocused2 ? styles.buttonTextFocused : styles.buttonText,
                    ]}>
                    Videos
                  </Text>
                </TouchableOpacity>

                {/* add to collection or delete from collection */}
                {inCollection ? (
                  <TouchableOpacity
                    // ref={ref[3]}
                    // ref={button4}
                    ref={Platform.OS === 'web' ? button5.ref : button5}
                    style={[
                      styles.button,
                      isFocused5 ? styles.buttonFocused : styles.buttonNotFocused,
                    ]}
                    onFocus={handleFocus5}
                    onBlur={handleBlur5}
                    onPress={handleDeleteFromCollectionPress}
                    activeOpacity={0.7}
                    >
                    <Text
                      style={[
                        styles.buttonText,
                        isFocused5 ? styles.buttonTextFocused : styles.buttonText,
                      ]}>
                      Delete from Collection
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    // ref={ref[3]}
                    // ref={button4}
                    ref={Platform.OS === 'web' ? button5.ref : button5}
                    style={[
                      styles.button,
                      isFocused5 ? styles.buttonFocused : styles.buttonNotFocused,
                    ]}
                    onFocus={handleFocus5}
                    onBlur={handleBlur5}
                    onPress={handleAddToCollectionPress}
                    activeOpacity={0.7}
                    >
                    <Text
                      style={[
                        styles.buttonText,
                        isFocused5 ? styles.buttonTextFocused : styles.buttonText,
                      ]}>
                      Add to Collection
                    </Text>
                  </TouchableOpacity>
                )}

                {/* open in kick */}
                <TouchableOpacity
                  // ref={ref[2]}
                  // ref={button3}
                  ref={Platform.OS === 'web' ? button3.ref : button3}
                  style={[
                    styles.button,
                    isFocused3 ? styles.buttonFocused : styles.buttonNotFocused,
                  ]}
                  onFocus={handleFocus3}
                  onBlur={handleBlur3}
                  onPress={handleOpenInKickPress}
                  activeOpacity={0.7}
                  >
                  <Text
                    style={[
                      styles.buttonText,
                      isFocused3 ? styles.buttonTextFocused : styles.buttonText,
                    ]}>
                    Open in Kick
                  </Text>
                </TouchableOpacity>


              </View>
            </View>
          ) : (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineText}>Offline</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  // ref={button1}
                  ref={Platform.OS === 'web' ? button1.ref : button4}
                  style={[
                    styles.button,
                    isFocused4 ? styles.buttonFocused : styles.buttonNotFocused,
                  ]}
                  onFocus={handleFocus4}
                  onBlur={handleBlur4}
                  onPress={handleVideosPress}
                  activeOpacity={0.7}
                  >
                  <Text
                    style={[
                      styles.buttonText,
                      isFocused4 ? styles.buttonTextFocused : styles.buttonText,
                    ]}>
                    Videos
                  </Text>
                </TouchableOpacity>

                {/* add to collection or delete from collection  */}
                {
                  inCollection ? (
                    <TouchableOpacity
                      // ref={ref[3]}
                      // ref={button4}
                      ref={Platform.OS === 'web' ? button6.ref : button6}
                      style={[
                        styles.button,
                        isFocused6 ? styles.buttonFocused : styles.buttonNotFocused,
                      ]}
                      onFocus={handleFocus6}
                      onBlur={handleBlur6}
                      onPress={handleDeleteFromCollectionPress}
                      activeOpacity={0.7}
                      >
                      <Text
                        style={[
                          styles.buttonText,
                          isFocused6 ? styles.buttonTextFocused : styles.buttonText,
                        ]}>
                        Delete from Collection
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      // ref={ref[3]}
                      // ref={button4}
                      ref={Platform.OS === 'web' ? button6.ref : button6}
                      style={[
                        styles.button,
                        isFocused6 ? styles.buttonFocused : styles.buttonNotFocused,
                      ]}
                      onFocus={handleFocus6}
                      onBlur={handleBlur6}
                      onPress={handleAddToCollectionPress}
                      activeOpacity={0.7}
                      >
                      <Text
                        style={[
                          styles.buttonText,
                          isFocused6 ? styles.buttonTextFocused : styles.buttonText,
                        ]}>
                        Add to Collection
                      </Text>
                    </TouchableOpacity>
                  )
                }

              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282c34', // Dark background color
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 2,
    marginLeft: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white', // Username text color
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  followers: {
    fontSize: 16,
    marginLeft: 8,
    color: 'white', // Followers text color
  },
  liveContainer: {
    marginTop: 16,
  },
  liveText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white', // Live text color
  },
  viewerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewerCount: {
    fontSize: 16,
    marginLeft: 8,
    color: 'white', // Viewer count text color
  },
  offlineContainer: {
    marginTop: 16,
  },
  offlineText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white', // Offline text color
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    flexWrap: 'wrap',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // width: '100%',
    // padding: 10,
  },
  // button: {
  //   backgroundColor: '#007bff', // blueist color
  //   padding: 12,
  //   borderRadius: 8,
  //   marginRight: 8,
  //   alignItems: 'center',
  //   // backgroundColor: '#841584',
  //   // width: '45%', // Adjusted to fit two buttons with space in between
  //   // padding: 10,
  //   // borderRadius: 5,
  //   // alignItems: 'center',
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
  buttonMargin: {
    marginLeft: 10, // Add margin to the left of the second button
  },
  buttonText: {
    // color: 'white',
    // textAlign: 'center',
    color: '#fff', // Makes the button text white
    fontWeight: 'bold', // Makes the button text bold
  },
  buttonTextFocused: {
    color: 'yellow', // Makes the button text black
  },
  verifiedAndName: { flexDirection: 'row', alignItems: 'center' },
  verifiedStyle: { marginRight: 5, marginTop: -10 },
});

export default KickProfile;
