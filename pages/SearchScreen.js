import React, { useEffect,useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image, Keyboard } from 'react-native';
import { getDatabase, ref, get, child, onValue, update } from "firebase/database";
import { getStorage, ref as refStorage, getDownloadURL } from "firebase/storage";
import { app } from "../Firebase.js";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { Svg, Path } from 'react-native-svg';


const db = getDatabase(app);
const storage = getStorage();

const SearchScreen = ({ route }) => {
  const { curUserId } = route.params;
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const navigation = useNavigation();
  
  useEffect(() => {
    // Simulated data for discussion posts
    const fetchDiscussionPosts = async () => {
      try {
        const dbref = ref(db, "Users/")
        onValue(dbref, (snapshot) => {
          data = snapshot.val()
          if (data) {
            const userInfo = Object.keys(data).map(async (key) => {
                const userInfo = data[key];
                const defaultStorageRef = refStorage(storage, '1.jpg');
                const defaultUrl = await getDownloadURL(defaultStorageRef);
                const storageRef = refStorage(storage, String(key) + '.jpg');
                const url = await getDownloadURL(storageRef).catch((error) => {
                  console.log(error);
                });
                return { username: userInfo.username, userId: key, profilePic: url !== undefined ? url : defaultUrl};
            });
            Promise.all(userInfo).then(userInfoArr => {
              setDataArray(userInfoArr);
            })
          }
        })
      } catch (error) {
        console.error('Error fetching discussion posts: ', error);
      }
    }

    fetchDiscussionPosts();
  }, []);

  const renderResults = ({ item }) => {
    if (!item) {
      return null;
    }
    console.log(item);
    return (
      <TouchableOpacity onPress={() => handleProfilePress(item.userId)} style={styles.item}>
        <Image source={{uri: item.profilePic}} style={styles.profilePic} />
        <Text style={styles.usernameText}>{item.username}</Text>
      </TouchableOpacity>
      );
  };
  

  const handleProfilePress = (user) => {
    navigation.navigate('UserProfile', {userId: curUserId, profileId: user });
  }

  const handleSearch = (text) => {
    const filteredResults = text ? dataArray.filter((item) => {
      if (item.username) {
        return item.username.toLowerCase().includes(text.toLowerCase());
      }
      return false;
    }) : [];
    setSearchText(text);
    setSearchResults(filteredResults);
  };
  
  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  const SvgPenis = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.penisContainer} onPress={dismissKeyboard}>
        <Svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="128" 
          height="128" 
          viewBox="0 0 128 128" 
          fill="none"
        >
          <Path 
            d="M60.1 39.8C45.14 42.08 22.93 37.5 8.03 56.87C-2.88 71.04 -1.95 94.04 9.53 106.89C18.06 116.44 32.06 122.85 50.38 121.09C99.15 116.4 114.55 54.35 114.55 54.35L122.39 28.38L94.97 10.1C94.97 10.1 78.01 37.08 60.1 39.8Z" 
            fill="#D7598B"
          />
          <Path 
            d="M127.59 56.56C127.5 56.15 127.21 55.73 126.94 55.32C126.84 55.17 126.74 55.03 126.67 54.91C124.02 50.21 124.96 45.27 125.96 40.04C126.94 34.91 127.95 29.61 125.36 24.47C125.04 23.84 124.62 23.2 124.21 22.59C123.31 21.23 122.37 19.83 122.47 18.42C122.52 17.65 122.98 16.91 123.47 16.13C124.15 15.06 124.91 13.84 124.6 12.33C124.07 9.83 120.87 8.23 118.75 7.17L118.43 7C118.32 6.95 118.24 6.9 118.17 6.86C117.99 6.76 117.78 6.63 117.47 6.63C117.24 6.63 117.03 6.69 116.65 6.81C116.54 6.84 116.45 6.86 116.37 6.88C116.02 6.96 115.78 7.04 115.36 7.38C113.96 8.55 112.68 9.1 111.22 9.16C110.78 9.18 110.33 9.18 109.88 9.18C108.41 9.18 106.91 9.1 105.45 9.01C103.99 8.93 102.47 8.84 100.98 8.84C98 8.84 95.6 9.2 93.44 9.98C92.56 10.29 91.68 10.64 90.79 10.98C88.47 11.88 86.07 12.81 83.67 13.32C82.67 13.53 81.72 13.63 80.75 13.63C78.85 13.63 77.13 13.23 75.14 12.77C74.66 12.65 74.18 12.54 73.67 12.43C73.41 12.37 73.16 12.35 72.93 12.35C71.95 12.35 71.42 12.85 71.15 13.26C70.45 14.34 70.71 16.16 71.26 17.39C72.56 20.35 75.43 22.76 80.03 24.74C82.95 26 85.91 26.64 88.83 26.64C90.23 26.64 91.62 26.49 92.97 26.19C93.31 26.12 93.64 26.06 93.97 26C94.36 25.93 94.73 25.86 95.13 25.77L95.39 25.71C95.77 25.62 96.35 25.47 96.78 25.47C97.02 25.47 97.1 25.52 97.1 25.52C97.26 25.61 97.32 25.7 97.02 26.51C96.89 26.84 96.71 27.11 96.49 27.41C96.34 27.63 96.19 27.86 96.05 28.1C95.74 28.65 95.55 29.24 95.36 29.8C95.28 30.05 95.2 30.29 95.11 30.52C93.8 34.04 94.32 37.15 95.09 39.99C95.43 41.26 95.94 42.46 96.54 43.37C96.65 43.55 96.77 43.73 96.88 43.91C97.38 44.73 97.95 45.65 98.76 46.23C99.44 46.73 100.1 46.97 100.77 46.97C102.12 46.97 103.2 45.94 104.07 45.11C105.43 43.81 106.56 42.13 107.65 40.5L108.14 39.76C108.7 38.93 109.81 37.29 110.8 36.64C111.43 40.18 114.01 49.69 114.05 49.79C116.42 55.18 120.35 58.15 125.14 58.15C125.32 58.15 125.44 58.15 125.57 58.16C125.73 58.17 125.9 58.18 126.06 58.18C126.45 58.18 127 58.13 127.34 57.7C127.62 57.44 127.7 57.04 127.59 56.56ZM72.84 13.08C72.88 13.07 72.92 13.05 72.96 13.05C73.14 13.05 73.34 13.07 73.55 13.12C73.28 13.06 73.05 13.06 72.84 13.08ZM88.86 25.97C88.09 25.97 87.32 25.92 86.55 25.82C87.49 25.94 88.44 25.96 89.39 25.94C89.21 25.94 89.04 25.97 88.86 25.97ZM100.8 46.33C100.76 46.33 100.72 46.31 100.68 46.31C100.76 46.31 100.82 46.32 100.89 46.31C100.86 46.31 100.83 46.33 100.8 46.33ZM100.64 9.54C100.76 9.53 100.89 9.53 101.01 9.53C101.14 9.53 101.28 9.54 101.41 9.54H100.64ZM117.48 7.31C117.49 7.31 117.5 7.32 117.52 7.32C117.47 7.32 117.42 7.32 117.36 7.33C117.4 7.32 117.45 7.31 117.48 7.31ZM125.18 57.5C124.86 57.5 124.56 57.44 124.25 57.42C124.58 57.45 124.9 57.5 125.24 57.5H125.18ZM126.1 57.53C126.03 57.53 125.97 57.53 125.9 57.52C126.07 57.53 126.22 57.53 126.37 57.51C126.28 57.52 126.2 57.53 126.1 57.53Z" 
            fill="#BDCF46"
          />
          <Path 
            d="M35.88 53.12C29.24 54.11 20.61 56.91 16.43 64.57C7.45 81.03 18.79 88.05 26.04 77.8C37.61 61.45 55.31 58.23 50.47 54.49C48.46 52.93 40.88 52.38 35.88 53.12Z" 
            fill="white"
          />
          </Svg>
        <Text style={styles.penisText}>
          PEE PEE
        </Text>
        <Text>
          'connect ur contacts friendless bitch'
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        onChangeText={handleSearch}
        value={searchText}
        placeholderTextColor="#888"
      />
      {searchText !== '' ? (
        <FlatList
          data={searchResults}
          renderItem={renderResults}
          keyExtractor={(item) => item}
          ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
        />
      ) : null}
        {!searchResults.length && searchText === '' && <SvgPenis />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  usernameText: {
    fontSize: 18,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    color: '#555',
  },
  profilePic: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  penisContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 250,
  },
  penisText: {
    fontSize: 90,
    fontFamily: 'AcademyEngravedLetPlain',
    color: '#D7598B',
    shadowColor: '#BDCF46',
    shadowOpacity: 20,
    shadowRadius: 1,
  },
});

export default SearchScreen;
