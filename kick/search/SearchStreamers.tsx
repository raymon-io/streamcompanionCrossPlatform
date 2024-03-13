import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import KickProfile from '../Kickprofile';

const SearchFeature = () => {
    // const [searchTerm, setSearchTerm] = useState('');
    // const [results, setResults] = useState<string[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchFound, setSearchFound] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchStreamers, setSearchStreamers] = useState([]);

    const searchStreamer = async () => {
        if (searchTerm.length < 3) {
            setSearchFound(false);
            setSearching(false);
            return;
        }

        setSearching(true);
        const url = 'https://kick.com/api/search?searched_word=' + searchTerm;
        const response = await fetch(url);

        if (response.status === 200) {
            const data = await response.json();
            if (data.channels && data.channels.length > 0) {
                const channels = data.channels;
                // Add your logic for updating channels here
                setSearchStreamers(channels);
                setSearchFound(true);
            } else {
                setSearchFound(false);
            }
        } else {
            setSearchFound(false);
        }
        setSearching(false);
    };

    // button 1 focus
    const [button1Focus, setButton1Focus] = useState(false);
    const [button2Focus, setButton2Focus] = useState(false);

    // text input focus or ref
    const textInputRef = React.useRef<any>(null);

    const [searchFocus, setSearchFocus] = useState<boolean>(false);
    const [button3Focus, setButton3Focus] = useState<boolean>(false);

    useEffect(() => {
        console.log('searchFocus', searchFocus);
    }, [searchFocus]);

    const navigation = useNavigation();

    // const handleSearch = () => {
    //     // Perform the search here. This is just a dummy example.
    //     const dummyData = ['Streamer1', 'Streamer2', 'Streamer3'];
    //     const filteredData = dummyData.filter(item => item.includes(searchTerm));
    //     setResults(filteredData);
    // };

    const handleFocus = () => {
        if (textInputRef.current && textInputRef.current.focus) {
            textInputRef.current.focus();
        }
    }

    return (
        <View style={styles.container}>
            {/* back button touchable opacity */}
            <TouchableOpacity
                style={[styles.button, button1Focus ? styles.buttonFocused : styles.buttonNotFocused]}
                onPress={() => navigation.goBack()}
                onFocus={() => setButton1Focus(true)}
                onBlur={() => setButton1Focus(false)}
            >
                <Text style={[styles.buttonText, button1Focus ? styles.buttonTextFocused : styles.buttonTextNotFocused]}>Back</Text>
            </TouchableOpacity>

            {/* text input to search */}
            <TextInput
                ref={textInputRef}
                focusable={true}
                autoFocus={true}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 5 }}
                // onChangeText={text => setSearchTerm(text)}
                value={searchTerm}
                placeholder="Search for streamers"
                onChangeText={setSearchTerm}
                onSubmitEditing={searchStreamer}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
            />

            {/* type again (focus on the text input) */}

            {
                !searchFocus ? (
                    <TouchableOpacity
                        style={[styles.button, button3Focus ? styles.buttonFocused : styles.buttonNotFocused]}
                        onPress={() => handleFocus()}
                        onFocus={() => setButton3Focus(true)}
                        onBlur={() => setButton3Focus(false)}
                    >
                        <Text style={[styles.buttonText, button3Focus ? styles.buttonTextFocused : styles.buttonTextNotFocused]}>Type Again</Text>
                    </TouchableOpacity>
                ) : (<></>)
            }

            {/* search button touchable opacity */}
            <TouchableOpacity
                style={[styles.button, button2Focus ? styles.buttonFocused : styles.buttonNotFocused]}
                onPress={searchStreamer}
                onFocus={() => setButton2Focus(true)}
                onBlur={() => setButton2Focus(false)}
            >
                <Text style={[styles.buttonText, button2Focus ? styles.buttonTextFocused : styles.buttonTextNotFocused]}>Search</Text>
            </TouchableOpacity>

            {searching && <ActivityIndicator />}
            {!searchFound && <Text>No results found</Text>}
            <FlatList data={searchStreamers} renderItem={({ item }) => <KickProfile streamer={item} />} keyExtractor={(item: any, index) => item.id || index.toString()} />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'black', // dark grayish color
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
        marginBottom: 5,
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
    container: {
        flex: 1,
        backgroundColor: '#20232A', // Dark background color
        padding: 10,
    },
});

export default SearchFeature;