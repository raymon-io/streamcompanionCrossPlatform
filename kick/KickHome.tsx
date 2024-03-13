import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Platform, TVFocusGuideView } from 'react-native';

import { Kickinterface } from './interfaces/Kickinterface';
import { getApi } from './services/Kickservice';
import KickProfile from './Kickprofile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const KickHome = () => {
  // variables

  // hard coded
  const featuredStreamersListHardCoded = ['xqc'];
  // const myCollectionStreamers: any[] = [];
  const [myCollectionStreamers, setMyCollectionStreamers] = useState<any[]>([]);
  const [featuredStreamersHardCoded, setFeaturedStreamersHardCoded] = useState<
    (Kickinterface | null)[]
  >([]);

  // search
  // search button focus
  const [searchFocus, setSearchFocus] = useState<boolean>(false);
  // back
  const [backFocus, setBackFocus] = useState<boolean>(false);
  const button1 = useRef(null);

  // non following
  const [nonFollowing, setNonFollowing] = useState<(Kickinterface | null)[]>(
    [],
  );

  const navigation = useNavigation();

  //functions
  useEffect(() => {
    getHardCodedFeaturedStreamers();
    getNonFollowingFeatured();
    getMyCollection();
  }, []);

  const getMyCollection = async () => {
    let myCollectionStr: any;
    try {
      myCollectionStr = await AsyncStorage.getItem('collection');
    } catch (error) {
      console.log('error', error);
    }

    if (myCollectionStr) {
      const myCollection = JSON.parse(myCollectionStr);
      // add to myCollectionStreamers
      for (const i of myCollection) {
        // myCollectionStreamers.push(i);
        // setMyCollectionStreamers(prevStreamers => [...prevStreamers, i]);
        console.log('getting myCollection streamer', i);
        const data = await getApi(i);
        if (data) {
          setMyCollectionStreamers(prevStreamers => [...prevStreamers, data]);
        } else {
          console.log('fail getApi');
        }
      }
      if (myCollectionStreamers.length > 0) {
        console.log('myCollectionStreamers', myCollectionStreamers);
      }
    } else {
      console.log('no myCollection');
    }

  };


  const getHardCodedFeaturedStreamers = async () => {
    for (const i of featuredStreamersListHardCoded) {
      const data = await getApi(i);
      if (data) {
        setFeaturedStreamersHardCoded(prevStreamers => [...prevStreamers, data]);
      } else {
        console.log('fail getApi');
      }
    }
  };

  const getNonFollowingFeatured = async () => {
    console.log('//////////// FETCH NONFOLLOWING start');
    const url = 'https://kick.com/featured-livestreams/non-following';
    const url2 = url; // use a proxy url to avoid CORS issues
    let response: any;
    try {
      response = await fetch(url);
      console.log('FETCH NONFOLLOWING status', response.status, 'url', url);
    } catch (error) {
      console.log('FETCH NONFOLLOWING error', error, 'url', url);
    }
    // const response = await fetch(url);
    var nonFollowingVar: (Kickinterface | null)[] = [];
    if (response && response.status === 200) {
      console.log('FETCH NONFOLLOWING success for url ************', url);
      const data = await response.json();
      // from the data, the data comes with is_live, profile_picture, channel_slug, viewers_count
      // using these data map it to the Kickinterface
      for (const i of data) {
        const tempKickProfile: Kickinterface = {
          slug: i.channel_slug,
          livestream: {
            is_live: i.is_live,
            categories: [i.category_name],
            viewer_count: i.viewer_count,
          },
          user: {
            profile_pic: i.profile_picture,
            username: i.user_username,
          },
        };
        nonFollowingVar.push(tempKickProfile);
      }
    } else {
      console.log('RUNPLAY NONFOLLOWING start');
      if (response) {
        console.log('RUNPLAY NONFOLLOWING status', response.status);
      }
      let response2: any;
      try {
        response2 = await fetch(url2);
        console.log('RUNPLAY NONFOLLOWING status', response.status);
      } catch (error) {
        console.log('RUNPLAY NONFOLLOWING error ', error, 'url2', url2);
      }
      // const response2 = await fetch(url2);
      if (response2 && response2.status === 200) {
        const data = await response2.json();
        console.log('RUNPLAY NONFOLLOWING success **********');
        // from the data, the data comes with is_live, profile_picture, channel_slug, viewers_count
        // using these data map it to the Kickinterface
        for (const i of data) {
          const tempKickProfile: Kickinterface = {
            slug: i.channel_slug,
            livestream: {
              is_live: i.is_live,
              categories: [i.category_name],
              viewer_count: i.viewer_count,
            },
            user: {
              profile_pic: i.profile_picture,
              username: i.user_username,
            },
          };
          nonFollowingVar.push(tempKickProfile);
        }
      } else {
        console.log('RUNPLAY NONFOLLOWING fail !!!!!!!!');
      }
    }
    setNonFollowing(nonFollowingVar);
    // setNonFollowing(prevStreamers => [...prevStreamers, ...nonFollowingVar]);
    console.log('//////////// FETCH NONFOLLOWING end \n\n\n');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kick Featured Streamers</Text>

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

      <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>

        {/* back button */}
        <TouchableOpacity
          ref={button1}
          style={[styles.button, backFocus ? styles.buttonFocused : styles.buttonNotFocused]}
          // @ts-ignore
          onPress={() => navigation.goBack()}
          onFocus={() => setBackFocus(true)}
          onBlur={() => setBackFocus(false)}
          activeOpacity={0.7}
          >
          <Text style={[styles.buttonText, backFocus? styles.buttonTextFocused: styles.buttonTextNotFocused]}>Back</Text>
        </TouchableOpacity>
        {/* hard coded streamers  */}
        {featuredStreamersHardCoded.length === 0 ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          featuredStreamersHardCoded.map((streamer, index) => (
            <KickProfile streamer={streamer} key={index} setupFocus={true} />
          ))
        )}
        {/* my collection */}
        {myCollectionStreamers.length > 0 ? (
          <Text style={styles.header}>My Collection</Text>
        ) : (
          // <Text style={styles.header}>No streamer in collection</Text>
          <></>
        )}
        {myCollectionStreamers.length === 0 ? (<></>) : (
          myCollectionStreamers.map((streamer, index) => (
            <KickProfile streamer={streamer} key={index} setupFocus={true} inCollection={true} />
          ))
        )}

        {/* <SearchStreamers/> */}
        <TouchableOpacity
          style={[styles.button, searchFocus ? styles.buttonFocused : styles.buttonNotFocused]}
          // @ts-ignore
          onPress={() => navigation.navigate('SearchStreamers')}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          activeOpacity={0.7}
          >
          <Text style={[styles.buttonText, searchFocus? styles.buttonTextFocused: styles.buttonTextNotFocused]}>Search Streamers</Text>
        </TouchableOpacity>

        {/* non following */}
        <Text style={styles.header}>Other Featured Streamers</Text>
        {nonFollowing.length === 0 ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          nonFollowing.map((streamer, index) => (
            <KickProfile streamer={streamer} key={index} setupFocus={false} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20232A', // Dark background color
    padding: 10,
  },
  header: {
    fontSize: 16, // Larger font size
    fontWeight: 'bold',
    color: 'white', // Header text color
    textAlign: 'center',
    padding: 10,
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
  profileHeadContainer: {
    backgroundColor: '#282c34', // Dark background color
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
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
});

export default KickHome;
