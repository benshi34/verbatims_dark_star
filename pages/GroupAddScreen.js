import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  TextInput,
  BackHandler,
  Alert,
} from "react-native";
import { getDatabase, ref, get, onValue, push, child, set, update } from "firebase/database";
import {
  getStorage,
  ref as refStorage,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../Firebase.js";
import { useNavigation } from "@react-navigation/native";
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo's vector icons

const storage = getStorage();

const GroupAddScreen = ({ route }) => {
  const { id } = route.params;
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [usersIds, setUsersIds] = useState({});
  const [pressedIndices, setPressedIndices] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dataArray, setDataArray] = useState([]);
  const [showSearch,setShowSearch] = useState(false);
  const [pfpUsers,setPfpUsers] = useState({});
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isDuplicatePerson, setDuplicatePerson] = useState(false);

  const db = getDatabase(app);
  const navigation = useNavigation();

  const downloadUrl = async (profileId) => {
    const defaultStorageRef = await refStorage(storage, '1.jpg');
    const defaultUrl = await getDownloadURL(defaultStorageRef);
    const storageRef = await refStorage(storage, String(profileId) + '.jpg');
    const url = await getDownloadURL(storageRef).catch((error) => {
      console.log(error);
    });
    return (url !== undefined ? url : defaultUrl);
  }  

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  },[showSearch])
  
  const backAction = () => {
    goBack();
    return true;
  };
  
  const goBack = () => {
    if(showSearch){
      setShowSearch(false);
    } else {
      navigation.navigate('Groups');
    }
  };

  const createGroup = () => {
    if (groupName && groupName.trim() !== '') {
      const newGroupKey = push(child(ref(db), "Groups")).key;

      updatedData = {}
      let tempGroupKey = push(child(ref(db), 'Groups/' + newGroupKey + "/users")).key;
      let updatedUsersIds = usersIds
      updatedUsersIds[tempGroupKey] = id
      set(ref(db, "Groups/" + newGroupKey), {
        id: newGroupKey,
        name: groupName,
        users: updatedUsersIds,
      });
      const updates = {};
      const newPostKey = push(child(ref(db), 'Users/' + id + "/groups")).key;
      updates["/"+newPostKey] = newGroupKey;
      update(ref(db, 'Users/' + id + "/groups"), updates);
      
      const values = Object.values(usersIds)
      for (let tempId in values) {
        let temp = push(child(ref(db), 'Users/' + values[tempId] + "/groups")).key;
        updates["/"+temp] = newGroupKey
        update(ref(db, 'Users/' + values[tempId] + "/groups"), updates);
      }

      /*const updates = {};
      updates["Groups/" + group["id"] + "/verbatims/" + newGroupVerbatimKey] = newVerbatimKey;
      update(ref(db), updates);*/
      navigation.goBack();
    } else {
      setAlertVisible(true);
    }
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const hideDuplicateAlert = () => {
    setDuplicatePerson(false);
  };

  const getUsernameFromID = (userIdValue) => {
    const dbref = ref(db, "Users/" + userIdValue);

    return new Promise((resolve, reject) => {
      get(dbref)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            resolve(data["username"]);
          } else {
            reject(new Error("User not found."));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const fetchUsers = () => {
    console.log("USER ID");
    console.log(id);
    const dbref = ref(db, "Users/" + id + "/friends");
    get(dbref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          data = snapshot.val();
          let friends = Object.values(data);

          const friendsArr = friends.map((element) => ({
            id: element,
          }));

          const promises = [];
          for (let i = 0; i < friendsArr.length; i++) {
            const friend = friendsArr[i];
            const promise = getUsernameFromID(friend["id"])
              .then((username) => {
                friendsArr[i]["username"] = username;
              })
              .catch((error) => {
                console.error(error);
              });
            promises.push(promise);
          }

          Promise.all(promises)
            .then(() => {
              console.log(friendsArr);
              setUsers(friendsArr);
              setUsersIds(data);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        //console.log("6");
        console.error(error);
      });
  };

  const userSelected = (index, user) => {
    if (pressedIndices.includes(index)) {
      setPressedIndices(
        pressedIndices.filter((pressedIndex) => pressedIndex !== index)
      );
    } else {
      setPressedIndices([...pressedIndices, index]);
    }
  };

  const updateProfilePics = async () => {
    const updatedPfps = {};
    for(const i in users){
      await downloadUrl(users[i].id)
      .then((url) => {
        console.log(url);
        updatedPfps[users[i].id]=url;
      })
      .catch((error) => {
        updatedPfps[users[i].id]='https://firebasestorage.googleapis.com/v0/b/verbatims-4622f.appspot.com/o/1.jpg?alt=media&token=42a40419-f444-4648-a1b3-8c25aebb21cd';
        console.log(error);
      });
    }
    return updatedPfps;
  }

  useEffect(()=>{
    updateProfilePics()
      .then((updatedPfps) => {
        setPfpUsers(updatedPfps);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [users])

  useEffect(() => {
    //fetchUsers();
  }, []);

  
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
    //item.userId
    return (
      <TouchableOpacity onPress={() => handleProfilePress(item)} style={styles.item}>
        <Image source={{uri: item.profilePic}} style={styles.profilePic} />
        <Text style={styles.usernameText}>{item.username}</Text>
      </TouchableOpacity>
    );
  };
  

  const handleProfilePress = (item) => {
    setShowSearch(false);
    setSearchText('');

    updatedUsersId = usersIds;

    updatedUsersId[uuid.v1()]=item.userId;
    const newElement = {};
    newElement["id"]=item.userId;
    newElement["username"]=item.username;
    //console.log(updatedUsersId);
    let isDuplicate = false;
    for(const i in users){
      if(users[i].id===newElement.id&&users[i].username===newElement.username){
        isDuplicate=true;
      }
    }
    if(!isDuplicate){
      setUsersIds(updatedUsersId);
      setUsers(users=>[...users,newElement])
    } else {
      setDuplicatePerson(true);
    }
    //item.userId
    //navigation.navigate('UserProfile', {userId: id, profileId: user });
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

  const togglePopup = () => {
    setShowSearch(true);
  }
  if(showSearch){
    return(
      <View>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.title}>Search User</Text>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      {isAlertVisible && (
        Alert.alert(
          'Alert',
          'The group name must not be empty',
          [
            {
              text: 'Exit',
              onPress: hideAlert,
            },
          ],
          { cancelable: false }
        )
      )}

      {isDuplicatePerson && (
        Alert.alert(
          'Alert',
          'Duplicate people cannot be added to a group',
          [
            {
              text: 'Exit',
              onPress: hideDuplicateAlert,
            },
          ],
          { cancelable: false }
        )
      )}
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Create New Group</Text>
        <TextInput
          placeholder="Group Name"
          value={groupName}
          onChangeText={(text) => setGroupName(text)}
          style={styles.input}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {users.map((user, index) => {
          const buttonStyle = styles.purpleButtonText;
          return (
            <View
              style={styles.chooseButtonContainer}
              key={index}
            >
              <Image
                source={{uri:pfpUsers[user.id]}}
                style={styles.image}
              />
              <Text style={buttonStyle}>{user["username"]}</Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.centerContainer}>
        <TouchableOpacity style={styles.button} onPress={togglePopup}>
          <Text style={styles.buttonText}>Add Member To Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={createGroup}>
          <Text style={styles.buttonText}>Create Group Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    marginTop: 30,
    position: 'absolute',
    top: 20, // Adjust the value to position the button as needed
    left: 20, // Adjust the value to position the button as needed
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100, // To create a circular button
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: 'center',
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderRadius: 8,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  purpleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3E63E4",
    marginLeft: 10,
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "#4287f5",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  listText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
  scrollContainer: {
    paddingLeft: 40,
    marginBottom: 20,
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

export default GroupAddScreen