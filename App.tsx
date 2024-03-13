import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Linking, TVFocusGuideView, Alert } from 'react-native';
import { BackHandler, TVEventControl } from 'react-native';
import { Platform } from 'react-native';


// navigation
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { init, useFocusable, setFocus } from '@noriginmedia/norigin-spatial-navigation';

declare global {
  interface Window {
    tizen: any;
  }
}

// kick home
import KickHome from './kick/KickHome';
import KickWatchLive from './kick/kickwatchlive/KickWatchLive';
import VideosPage from './kick/kickvideo/VideosPage';
import KickVideoWatch from './kick/kickvideo/KickVideoWatch';
import SearchStreamers from './kick/search/SearchStreamers';

const Stack = createStackNavigator();

function MyStack() {
  console.log('MyStack Platform.OS: ', Platform.OS);
  console.log('MyStack Platform.isTV: ', Platform.isTV);

  // tizen or web button handler
  const navigation = useNavigation();
  function keydownHandler(e: { keyCode: number }) {
    console.log('keydownHandler keyCode: ', e.keyCode);
    switch (e.keyCode) {
      case 10009: // tizen tv remote back button
        console.log('back or exit');
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          // check if tizen
          if (window.tizen && window.tizen.application) {
            window.tizen.application.getCurrentApplication().exit();
          }
        }
        break;
      // end of tizen tv remote back button case 10009
      default:
        break;
    }
  }

  if (Platform.OS === 'web') {
    useEffect(() => {
      window.addEventListener('keydown', keydownHandler);
      return () => {
        window.removeEventListener('keydown', keydownHandler);
      };
    }, []);
  } else {
    // tv menu and back button
    useEffect(() => {
      console.log('useEffect TVEventControl.enableTVMenuKey();');
      TVEventControl.enableTVMenuKey();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          console.log('hardwareBackPress');
          if (navigation.canGoBack()) {
            navigation.goBack();
            return true;
          } else {
            Alert.alert(
              'Exit App',
              'Do you want to exit?',
              [
                { text: 'No', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
              ],
              { cancelable: false },
            );
          }
          return true;
        },
      );
      return () => {
        console.log('useEffect TVEventControl.disableTVMenuKey();');
        backHandler.remove();
        TVEventControl.disableTVMenuKey();
      };
    }, []);
  }


  // }, []);

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="KickHome" component={KickHome} />
      <Stack.Screen name="KickWatchLive" component={KickWatchLive} />
      <Stack.Screen name="Videos" component={VideosPage} />
      <Stack.Screen name="KickVideoWatch" component={KickVideoWatch} />
      <Stack.Screen name="SearchStreamers" component={SearchStreamers} />
    </Stack.Navigator>
  );
}

const Home = () => {
  const navigation = useNavigation();

  // button focus
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleFocus2 = () => setIsFocused2(true);
  const handleBlur2 = () => setIsFocused2(false);

  // old focus
  // const button1 = React.useRef<any>(null);
  // const button2 = React.useRef<any>(null);


  let button1: any = null;
  let button2: any = null;
  // spatial focus
  if (Platform.OS === 'web') {
    button1 = useFocusable();
    button2 = useFocusable();
    useEffect(() => {
      init({
        // debug: true,
        // visualDebug: true,
        nativeMode: false
      }); // init spatial navigation
    }, []);

    // Listen for changes in focus
    useEffect(() => {
      if (button1.focused) {
        button1.ref.current?.focus();
      } else if (button2.focused) {
        button2.ref.current?.focus();
      }
    }, [button1.focused, button2.focused]);

    useEffect(() => {
      // old focus
      // if (button1 && button1.current) {
      //   button1.current.focus();
      // }
      if (button1 && button1.ref) {
        button1.ref.current.focus();
        setFocus(button1.focusKey);
      }
    }, []);

    // end of spatial focus

  } else {
    button1 = React.useRef<any>(null);
    button2 = React.useRef<any>(null);

  }


  // button functions
  const handleKickPress = () => {
    // @ts-ignore
    navigation.navigate('KickHome');
  }

  const handleAboutPress = () => {
    // @ts-ignore
    navigation.navigate('About');
  }


  return (
    <View style={styles.container}>
      {
        Platform.OS === 'web' ? <></> :
          <TVFocusGuideView
            destinations={[button1.current, button2.current]}
            autoFocus
            trapFocusDown={false}
            trapFocusUp={false}
            trapFocusLeft={false}
            trapFocusRight={false}
          ></TVFocusGuideView>
      }
      <TouchableOpacity
        // ref={button1} // old focus
        // ref={button1.ref} // spatial focus
        ref={Platform.OS === 'ios' ? button1 : button1.ref}
        style={[
          styles.button,
          {
            backgroundColor: isFocused ? 'blue' : 'black',
            borderColor: isFocused ? 'red' : 'black',
          },
        ]}
        onPress={handleKickPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        activeOpacity={0.7}>
        <Text style={{ color: isFocused ? 'black' : 'blue', fontSize: 20 }}>
          Kick Companion
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // ref={button2} // old focus
        // ref={button2.ref} // spatial focus
        ref={Platform.OS === 'ios' ? button2 : button2.ref}
        style={[
          styles.button,
          {
            backgroundColor: isFocused2 ? 'blue' : 'black',
            borderColor: isFocused2 ? 'red' : 'black',
          },
        ]}
        onPress={handleAboutPress}
        onFocus={handleFocus2}
        onBlur={handleBlur2}
        activeOpacity={0.7}>
        <Text style={{ color: isFocused2 ? 'black' : 'blue', fontSize: 20 }}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

const About = () => {

  console.log('About called');

  const navigation = useNavigation();

  let button1: any = null;
  let button2: any = null;
  let button3: any = null;

  // spatial focus
  if (Platform.OS === 'web') {
    button1 = useFocusable();
    button2 = useFocusable();
    button3 = useFocusable();

    // Listen for changes in focus
    useEffect(() => {
      if (button1.focused) {
        button1.ref.current?.focus();
      } else if (button2.focused) {
        button2.ref.current?.focus();
      } else if (button3.focused) {
        button3.ref.current?.focus();
      }
    }, [button1.focused, button2.focused, button3.focused]);

    useEffect(() => {
      if (button1 && button1.ref) {
        button1.ref.current.focus();
        setFocus(button1.focusKey);
      }
    }, []);
  } else {
    button1 = React.useRef<any>(null);
    button2 = React.useRef<any>(null);
    button3 = React.useRef<any>(null);
  }

  // focus functions
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [isFocused3, setIsFocused3] = useState(false);



  return (
    <View style={styles.container}>
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>About</Text>
      <Text style={{ color: 'white', padding: 10, fontSize: 18 }}>Stream Companion App consists of various tools designed to enhance the experience of watching live streams and video content.</Text>
      <Text style={{ color: 'white', padding: 10, fontSize: 18 }}>Currently it supports various tools to enhance the viewing experience of Kick. Future updates are planned to include tools for other streaming platforms.  It is not affliated with kick.com. </Text>

      {/* made by  */}
      <View style={styles.buttonContainer}>
        {/* <Text style={{ color: 'white', fontSize: 18 }}>Made by Raymon</Text> */}
        <TouchableOpacity
          ref={Platform.OS === 'web' ? button1.ref : button1}
          style={[styles.button, isFocused ? styles.buttonFocused : styles.buttonNotFocused]}
          onPress={() => {
            Linking.openURL('https://raymon.io/');
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          activeOpacity={0.7}
        >
          <Text style={[{ color: 'blue', fontSize: 18 }, isFocused ? styles.textFocused : styles.textNotFocused]}>Made by Raymon</Text>
        </TouchableOpacity>
      </View>

      {/* app availability */}
      {/* <Text style={{ color: 'white', padding: 10, fontSize: 18 }}>This app is available for both mobile and TV platform </Text> */}
      <View style={styles.buttonContainer}>
        <Text style={{ color: 'white', fontSize: 18, paddingTop: 10 }}>This app is available for both mobile and TV platform. For more info visit: </Text>
        <Text style={{ color: 'white', fontSize: 18 }}>https://streamcompanion.app/apps </Text>
        <TouchableOpacity
          ref={Platform.OS === 'web' ? button2.ref : button2}
          style={[styles.buttonwide, isFocused2 ? styles.buttonFocused : styles.buttonNotFocused]}
          onPress={() => {
            Linking.openURL('https://streamcompanion.app/apps');
          }}
          onFocus={() => setIsFocused2(true)}
          onBlur={() => setIsFocused2(false)}
          activeOpacity={0.7}
        >
          <Text style={[{ color: 'blue', fontSize: 18 }, isFocused2 ? styles.textFocused : styles.textNotFocused]}>Open Website</Text>
        </TouchableOpacity>
      </View>

      {/* go back */}

      <TouchableOpacity
        ref={Platform.OS === 'web' ? button3.ref : button3}
        style={[styles.button, isFocused3 ? styles.buttonFocused : styles.buttonNotFocused]}
        onPress={() => {
          // @ts-ignore
          navigation.goBack();
        }}
        onFocus={() => setIsFocused3(true)}
        onBlur={() => setIsFocused3(false)}
        activeOpacity={0.7}
      >
        <Text style={[{ color: 'blue', fontSize: 18 }, isFocused3 ? styles.textFocused : styles.textNotFocused]}>Go Back</Text>
        
      </TouchableOpacity>

      <Text style={{ color: 'white', fontSize: 18 }}>Current Version: 1.0.12</Text>

    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      backgroundColor: '#20232A', // Dark background color
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      borderWidth: 1,
      padding: 10,
      margin: 10,
      borderRadius: 10,
      width: 200,
      alignItems: 'center',
    },
    buttonFocused: {
      backgroundColor: 'blue',
      borderColor: 'red',
    },
    buttonNotFocused: {
      backgroundColor: 'black',
      borderColor: 'black',
    },
    textFocused: {
      color: 'black',
    },
    textNotFocused: {
      color: 'blue',
    },
    buttonwide: {
      borderWidth: 1,
      padding: 10,
      margin: 10,
      borderRadius: 10,
      width: 300,
      alignItems: 'center',
    },
    // about styles
    buttonContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 10,
    },
  }
);

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}