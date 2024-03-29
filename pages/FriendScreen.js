import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect} from 'react';
import { getDatabase, ref, get, onValue, remove, push, set, child, update } from "firebase/database";
import { app } from "../Firebase.js";
import { getStorage, ref as refStorage, getDownloadURL } from "firebase/storage";
import { useNavigation } from '@react-navigation/native';

const storage = getStorage();

const FriendScreen = ({ route }) => {
    const { userId, profileId } = route.params;
    const [friends, setFriends] = React.useState([]);
    const [friendsAdded, setFriendsAdded] = React.useState([]);
    const [friendRequests, setFriendRequests] = React.useState([]);

    const db = getDatabase(app);
    const navigation = useNavigation();
    


    useEffect(() => {
      // Simulated data for discussion posts
        const fetchFriends = async () => {
          try {
            const dbref = ref(db, `Users/${profileId}/friends`)
            onValue(dbref, (snapshot) => {
              data = snapshot.val();
              if (data) {
                const friendsArray = Object.keys(data).map((key) => {
                  return { id: key, friendId: data[key] };
                });
                const promises = friendsArray.map(async item => {
                  const defaultStorageRef = refStorage(storage, '1.jpg');
                  const defaultUrl = await getDownloadURL(defaultStorageRef);
                  const storageRef = refStorage(storage, String(item.friendId) + '.jpg');
                  const url = await getDownloadURL(storageRef).catch((error) => {
                    console.log(error);
                  });
                  const friendNameSnapshot = await get(ref(db, `Users/${item.friendId}/username`));
                  const friendName = friendNameSnapshot.val();
                  //return { ...item, profilePic: url === undefined ? defaultUrl : url, friendName: friendName};
                  //const friendStatus = await titleFriendButton(item);
                  const friendStatus = await titleFriendButton(item);
                  return { ...item, profilePic: url === undefined ? defaultUrl : url, friendName: friendName, isFriend: friendStatus};
                })
                Promise.all(promises).then(friendsArray => {
                  setFriends(friendsArray);
                })
              }
            })
          } catch (error) {
            console.error('Error fetching friends: ', error);
          }
        }
        fetchFriends();

        const fetchFriendRequests = async () => {
          try {
            const dbref = ref(db, `Users/${profileId}/friendrequests`)
            onValue(dbref, (snapshot) => {
              data = snapshot.val();
              if (data) {
                const friendsRequestsArray = Object.keys(data).map((key) => {
                  return { id: key, friendId: data[key] };
                });
                const promises = friendsRequestsArray.map(async item => {
                  const defaultStorageRef = refStorage(storage, '1.jpg');
                  const defaultUrl = await getDownloadURL(defaultStorageRef);
                  const storageRef = refStorage(storage, String(item.friendId) + '.jpg');
                  const url = await getDownloadURL(storageRef).catch((error) => {
                    console.log(error);
                  });
                  
                  const friendReqSnapshot = await get(ref(db, `Users/${item.friendId}/username`));
                  const friendReq = friendReqSnapshot.val();
                  const friendStatus = await titleFriendButton(item);
                  return { ...item, profilePic: url === undefined ? defaultUrl : url, friendName: friendReq, isFriend: friendStatus};
                })
                Promise.all(promises).then(friendsArray => {
                  setFriendRequests(friendsArray);
                })
              } 
              else {
                setFriendRequests([]);
              }
            })
          } catch (error) {
            console.error('Error fetching friends: ', error);
          }
        }
        fetchFriendRequests();
      }, []);

      


    const titleFriendButton = (item) => {
      return new Promise((resolve, reject) => {
        const dbref = ref(db, 'Users/' + userId + "/friends");
        onValue(dbref, (snapshot) => {
          if (snapshot.exists()) {
            data = snapshot.val();
            let verbatimsArray = Object.keys(data).map((key) => {
              return { id: key, value: data[key] };
            });
    
            let isFriend = false;
            let idFound = -1;
            verbatimsArray.forEach((friend) => {
              if (friend.value === item.friendId) {
                isFriend = true;
                idFound = friend.id;
              }
            });
    
            if (isFriend) {
              resolve("Friend");
            } else {
              resolve("Not Friend");
            }
          } else {
            resolve("Not Friend");
          }
        }).catch((error) => {
          reject(error);
        });
      });
    };
    

    const handleProfilePress = (friendId) => {
      navigation.navigate('UserProfile', {userId: userId, profileId: friendId });
    }
    const acceptRequest = (friend) => {
      if (friend !== undefined) {
        declineRequest(friend);
        const newRef = ref(db, `Users/${userId}/friends`);
        const friendRef = ref(db, `Users/${friend.friendId}/friends`);
        const newReqRef = push(newRef);
        const friendReqRef = push(friendRef);
        set(newReqRef, friend.friendId).then(() => {
          console.log("New item added successfully.")
        }).catch((error) => {
          console.log("New item could not be added: " + error.message)
        });
        set(friendReqRef, userId).then(() => {
          console.log("New item added successfully.")
        }).catch((error) => {
          console.log("New item could not be added: " + error.message)
        });
      }
    }

    const declineRequest = (friend) => {
      if (friend !== undefined) {
        console.log(friend);
        const valueRef = ref(db, `Users/${userId}/friendrequests/${friend.id}`);
        remove(valueRef).then(() => {
          console.log('Value deleted successfully.');
        }).catch((error) => {
          console.error('Error deleting value:', error);
        });
      }
    }

    const removeFriend = (friendId) => {
      const condition = (element) => friendId == element.friendId
      const deleteIndex = friends.findIndex(condition)
      if (deleteIndex !== null) {
        const deleteId = friends[deleteIndex].id;
        let cloned = [...friends];
        cloned.splice(deleteIndex, 1);
        setFriends(cloned);
        remove(ref(db, 'Users/' + userId + "/friends/" + deleteId)).then(() => {
          console.log("FRIEND DELETED!");
        }).catch((error) => {
          console.error(error);
        })
      }
    }
    
    const renderFriendItem = ({ item }) => {
      let showFriendButton = userId == profileId
      return (
          <TouchableOpacity onPress={() => handleProfilePress(item.friendId)} style={styles.friendItemContainer}>
            <Image source={{uri: item.profilePic}} style={styles.friendAvatar} />
            <Text style={styles.friendName}>{item.friendName}</Text>
            {showFriendButton &&
            <TouchableOpacity style={styles.removeButton} onPress={() => removeFriend(item.friendId)}>
              <Text style={styles.declineButtonText}>Remove Friend</Text>
            </TouchableOpacity>
            }
          </TouchableOpacity>
      );
    };
    
    const renderFriendRequestItem = ({ item }) => {
        return (
          <View style={styles.friendRequestItemContainer}>
            <Image source={{uri: item.profilePic}} style={styles.friendRequestAvatar} />
            <Text style={styles.friendRequestName}>{item.friendName}</Text>
            <TouchableOpacity style={styles.acceptButton} onPress={() => acceptRequest(item)}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton} onPress={() => declineRequest(item)}>
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        );
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Friends</Text>
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
          { userId == profileId && (
            <View style={styles.container2}>
            <Text style={styles.title}>Friend Requests</Text>
            <FlatList
              data={friendRequests}
              renderItem={renderFriendRequestItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
            /> 
            </View>
          )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 40,
      backgroundColor: '#fff',
    },
    container2: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      paddingTop: 20,
      color: '#4287f5',
      textAlign: 'center',
    },
    friendItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    friendAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    friendName: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
    },
    friendRequestItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    friendRequestAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    friendRequestName: {
      flex: 1,
      fontSize: 16,
      fontWeight: 'bold',
    },
    acceptButton: {
      backgroundColor: '#4287f5',
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginRight: 10,
    },
    acceptButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    declineButton: {
      backgroundColor: "#f5f5f5",
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    declineButtonText: {
      color: 'black',
      fontWeight: 'bold',
    },
    listContainer: {
      paddingBottom: 20,
    },
    removeButton: {
      backgroundColor: "#f5f5f5",
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
  });
export default FriendScreen