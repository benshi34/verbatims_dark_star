import React, { useEffect,useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import { getDatabase, ref, get, child, onValue, update } from "firebase/database";
import { app } from "../Firebase.js";

const db = getDatabase(app);

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

  useEffect(() => {
    // Simulated data for discussion posts
    const fetchDiscussionPosts = async () => {
      try {
        const dbref = ref(db, "Users/")
        onValue(dbref, (snapshot) => {
          data = snapshot.val()
          if (data) {
            const mapA = Object.keys(data).map((key) => {
                const user = data[key];
                return { username: user.username };
            });
            const usernameValues = mapA.map((obj) => obj.username);
            setDataArray(usernameValues);
          }
        })
      } catch (error) {
        console.error('Error fetching discussion posts: ', error);
      }
    }

    fetchDiscussionPosts();
  }, []);

  const handleSearch = (text) => {
    const filteredResults = text ? dataArray.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
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
          renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
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
    fontSize: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    color: '#555',
  },
});

export default SearchScreen;
