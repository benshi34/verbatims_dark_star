import React, { useEffect,useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, Image } from 'react-native';
import { getDatabase, ref, get, child, onValue, update } from "firebase/database";
import { getStorage, ref as refStorage, getDownloadURL } from "firebase/storage";
import { app } from "../Firebase.js";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


const db = getDatabase(app);
const storage = getStorage();

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  /*const dataArray = [
    'Apple',
    'Banana',
    'Cherry',
    'Durian',
    'Elderberry',
    'Fig',
    'Grapes',
    'Honeydew',
    'Kiwi',
    'Lemon',
    'Mango',
    'Orange',
    'Peach',
    'Quince',
    'Raspberry',
    'Strawberry',
    'Watermelon',
  ];*/
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
    let value = user
    navigation.navigate('UserProfile', { value });
  }

  const handleSearch = (text) => {
    const filteredResults = text ? dataArray.filter((item) => 
      item.username.toLowerCase().includes(text.toLowerCase())
    ) : [];
    setSearchText(text);
    setSearchResults(filteredResults);
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
});

export default SearchScreen;
