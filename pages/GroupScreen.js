import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import { getDatabase, ref, get, onValue } from "firebase/database";
import { getStorage, ref as refStorage, getDownloadURL } from "firebase/storage";
import { app } from "../Firebase.js";
import { useNavigation } from '@react-navigation/native';

const storage = getStorage();

const GroupScreen = ({ route }) => {
  const { curUserId } = route.params;
  const [Groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [Message, setMessage] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [isPressed, setIsPressed] = useState(false); //to change color

  const db = getDatabase(app);
  const navigation = useNavigation();
  const userId = curUserId;

  useEffect(() => {
    // Simulated data for discussion posts
      const fetchGroups = async () => {
        try {
          const dbref = ref(db, "Groups")
          onValue(dbref, (snapshot) => {
            data = snapshot.val()
            if (data) {
              const groupArray = Object.keys(data).map((key) => {
                return { id: key, ...data[key] };
              });
              const promises = groupArray.map(async item => {
                const defaultStorageRef = refStorage(storage, '1.jpg');
                const defaultUrl = await getDownloadURL(defaultStorageRef);
                const storageRef = refStorage(storage, String(item.id) + '.jpg');
                const url = await getDownloadURL(storageRef).catch((error) => {
                  console.log(error);
                });
                return { ...item, profilePic: url === undefined ? defaultUrl : url};
              })
              Promise.all(promises).then(groupArray => {
                setGroups(groupArray);
                setFilteredGroups(groupArray);
              })
              console.log(groupArray);
            }
          })
        } catch (error) {
          console.error('Error fetching groups: ', error);
        }
      }
      fetchGroups();

      const getVerbatims = async () => {
        try {
          const dbref = ref(db, 'Verbatims');
          get(dbref).then((snapshot) => {
            data = snapshot.val()
            if (data) {
              const verbatimsArray = Object.keys(data).map((key) => {
                return { id: key, ...data[key] };
              });
              setMessage(verbatimsArray)
            }
          })
        } catch (error) {
          console.error('Error fetching groups: ', error);
        }
      }
      getVerbatims(); 
    }, []);

    const MostRecentMessage = (groupid) => {
      str1 = "";
      mostRecent = "";
      mostRecentId = 0;
      mes_exist = false;
      for (let i = 0; i < Message.length; i++) {
        if (Message[i].group == groupid){
          mes_exist = true;
          str1 = Message[i].timestamp;
          if (str1 > mostRecent){
            mostRecent = str1;
            mostRecentId = i;
        }
      }
      }
      if (mes_exist == true){
        return Message[mostRecentId].verbaiterName + ": " + Message[mostRecentId].post;
      }
      else{
        return "No new messages"
      }
    }

    const handleSearch = (text) => {
      if (text === '') {
        setFilteredGroups(Groups);
      } else {
        const filteredResults = text ? Groups.filter((item) => 
          item.name.toLowerCase().includes(text.toLowerCase())
        ) : [];
        setFilteredGroups(filteredResults);
      }
      setSearchText(text);
    };

    const handleCreateGroup = () => {
      navigation.navigate("Create New Group", { id: userId });
    };
  
    const renderGroups = ({ item }) => {
      const handleGroupPress = () => {
        // Navigate to the chat window screen
        navigation.navigate('Chat', { id: item.id });
      };

      const boxStyle = styles.blueCircle;
      const timeStyle = styles.timeStampTextBlue;
  
      return (
        <TouchableOpacity style={styles.groupContainer} onPress={handleGroupPress}>
          <View style={styles.leftHalf}>
            <Image source={{uri: item.profilePic}} style={styles.groupPic} />
          </View>
          <View style={styles.rightHalf}>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.postText}>{MostRecentMessage(item.id)}</Text>
          </View>
        <Text style={[styles.box, timeStyle]}>{item.timestamp}</Text>
        <View style={[styles.box, boxStyle]}>
        <Text style={styles.arrowText}>➤</Text>
        </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style = {styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              onChangeText={handleSearch}
              value={searchText}
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
            <Text style={styles.buttonText}>Create Group</Text>
          </TouchableOpacity>
          {filteredGroups.map((item, index) => (
            <View key={index} style={styles.listContainer}>
              {renderGroups({ item })}
            </View>
          ))}
        </ScrollView>
      </View>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#4287f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  postContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupPic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    top: 8
  },
  postTextContainer: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  postText: {
    fontSize: 14,
    color: 'grey',
    top: 8,
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'row', // Arrange children in a row
    //backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
    position: 'relative',
  },
  leftHalf: {
    flex: 1, // Take half of the available space
    //backgroundColor: '#f5f5f5', // Customize the left half's background color
  },
  rightHalf: {
    flexDirection: 'column', // Arrange children in a row
    flex: 4, // Take half of the available space
    //backgroundColor: '#F5F5F5', // Customize the right half's background color
    
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  timeStampContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  timeStampTextBlue: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: 'blue',
  },
  timeStampTextGrey: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: 'grey',
  },
  blueCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue', // Set the desired background color for the circle
    paddingHorizontal: 0,
    paddingVertical: 0,
    bottom: 8,
    right: 20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  greyCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'grey', // Set the desired background color for the circle
    paddingHorizontal: 0,
    paddingVertical: 0,
    bottom: 8,
    right: 20, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
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
  searchContainer: {
    flex: 1,
    //padding: 1,
    //backgroundColor: '#f9f9f9',
  },
});

export default GroupScreen