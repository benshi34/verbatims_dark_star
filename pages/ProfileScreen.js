import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Button, KeyboardAvoidingView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, onValue, update, remove, push } from "firebase/database";
import { app } from "../Firebase.js";
import { getStorage, ref as refStorage, uploadBytes, putFile, getMetadata, getDownloadURL } from "firebase/storage";
import { useNavigation } from '@react-navigation/native';

const storage = getStorage();
const metadata = {
  contentType: 'image/jpeg',
};

const ProfileScreen = ({ route }) => {
  const [verbatims, setVerbatims] = useState([]);
  const [verbastards, setVerbastards] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [submittedShowImage, setSubmittedShowImage] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [friendButtonTitle, setFriendButtonTitle] = useState('');
  const [profilePicUrl,setProfilePicUrl] = useState('');
  const [currComments, setCurrComments] = useState([]);
  const [profileUsername, setProfileUsername] = useState('');
  const [showAllVerbatims, setShowAllVerbatims] = useState(false);
  const [showAllVerbastards, setShowAllVerbastards] = useState(false);
  const { userId, profileId } = route.params;
  //const htref = 'https://firebasestorage.googleapis.com/v0/b/verbatims-4622f.appspot.com/o/1.jpg?alt=media&token=11ea9825-a4e2-4a7b-97c1-c4ad1b1eaae2';  

  const db = getDatabase(app);

  const navigation = useNavigation();

  
  const downloadUrl = async () => {
    const defaultStorageRef = await refStorage(storage, '1.jpg');
    const defaultUrl = await getDownloadURL(defaultStorageRef);
    const storageRef = await refStorage(storage, String(profileId) + '.jpg');
    const url = await getDownloadURL(storageRef).catch((error) => {
      console.log(error);
    });
    return (url !== undefined ? url : defaultUrl);
    setProfilePicUrl(url !== undefined ? url : defaultUrl);
  }  

  const handleButtonPress = async () => {
    try { 
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        const file = await uriToFile(result.uri);
        const storageRef = await refStorage(storage, userId+'.jpg');
        const uploadTask = uploadBytes(storageRef, file, metadata);
        uploadTask
        .then((snapshot) => {
          downloadUrl()
          .then((url) => {
            setProfilePicUrl(url);
          })
          .catch((error) => {
            console.log(error);
          });
          //setSelectedImage(result.uri); 
        })
        .catch((error) => {
        });

        //setSelectedImage(result.uri);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };
  

  const uriToFile = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + profileId);

    return new File([blob], filename, { type: blob.type });
  };


  const addFriendButton = async () => {
    //console.log("1");
    let removed = false;
    const dbref = ref(db, 'Users/' + userId + "/friends");
    await get(dbref).then((snapshot) => {
      if (snapshot.exists()) {
        data=snapshot.val();
        //console.log("2");
        let verbatimsArray = Object.keys(data).map((key) => {
          return { id: key, value:data[key] };
        });

        let isFriend = false;
        let idFound = -1;
        verbatimsArray.forEach((friend) => {
          if (friend.value === profileId) {
            isFriend=true;
            idFound=friend.id;
          }
        });

        //const isFriend = verbatimsArray.some((friend) => friend.id === userId);
        

        if (isFriend) {
          //console.log("3");
          remove(ref(db, 'Users/' + userId + "/friends/"+idFound));
          removed=true;
        } else {
          //console.log("4");
          
          /*const newPostKey = push(child(ref(db), 'Users/' + userId + "/friends")).key;
          const updates = {};
          updates["/"+newPostKey] = profileId;
          update(ref(db, 'Users/' + userId + "/friends"), updates);*/
        }
      
      } else {
        //console.log("5");
        /*const updates = {};
        const newPostKey = push(child(ref(db), 'Users/' + userId + "/friends")).key;
        updates["/"+newPostKey] = profileId;
        update(ref(db, 'Users/' + userId + "/friends"), updates);*/
      }
    }).catch((error) => {
      //console.log("6");
      console.error(error);
    });



    //console.log("hiiiiiiiiiiiiii"+removed);


    if(!removed){
      const dbrefReq = ref(db, 'Users/' + profileId + "/friendrequests");
      get(dbrefReq).then((snapshot) => {
        if (snapshot.exists()) {
          data=snapshot.val();
          //console.log("2");
          let verbatimsArray = Object.keys(data).map((key) => {
            return { id: key, value:data[key] };
          });
  
          let isFriend = false;
          let idFound = -1;
          verbatimsArray.forEach((friend) => {
            if (friend.value === userId) {
              isFriend=true;
              idFound=friend.id;
            }
          });
  
          //const isFriend = verbatimsArray.some((friend) => friend.id === userId);
          
  
          if (isFriend) {
            //console.log("3");
            remove(ref(db, 'Users/' + profileId + "/friendrequests/"+idFound));
          } else {
            //console.log("4");
            
            const newPostKey = push(child(ref(db), 'Users/' + profileId + "/friendrequests")).key;
            const updates = {};
            updates["/"+newPostKey] = userId;
            update(ref(db, 'Users/' + profileId + "/friendrequests"), updates);
          }
        
        } else {
          //console.log("5");
          const updates = {};
          const newPostKey = push(child(ref(db), 'Users/' + profileId + "/friendrequests")).key;
          updates["/"+newPostKey] = userId;
          update(ref(db, 'Users/' + profileId + "/friendrequests"), updates);
        }
      }).catch((error) => {
        //console.log("6");
        console.error(error);
      });
    }
  }




  useEffect(() => {
    // Simulated data for discussion posts

    const fetchVerbatims = async () => {
      try {
        
        const fetchGroupsAsync = async () => {
          const includedGroups = await fetchGroups('Users/' + userId + "/groups");
          return includedGroups;
        };
        const fetchChatAsync = async (group) => {
          const includedGroups = await fetchGroups("Groups/"+group+"/verbatims");
          return includedGroups;
        };
        const fetchVerbatimAsync = async (group) => {
          const includedGroups = await retGet("Verbatims/"+group);
          return includedGroups;
        };

        fetchGroupsAsync().then((includedGroups) => {
          tempVerbatims=[];
          tempVerbastards=[];
          for(const group in includedGroups){
            fetchChatAsync(includedGroups[group]).then((verbatimsArray) => {
              for(const id in verbatimsArray){
                //console.log(verbatimsArray[id]);
                fetchVerbatimAsync(verbatimsArray[id]).then((selectedVerbatim) => {
                  //console.log(selectedVerbatim);
                  //console.log(selectedVerbatim);
                  //const mapC = selectedVerbatim.filter((item) => item.verbaiter === profileId);
                  //let tempVerbatims = verbatims;
                  //tempVerbatims = tempVerbatims.concat(mapC);
                  //setVerbatims(verbatims);
                  if (selectedVerbatim.verbaiter === profileId) {
                    tempVerbatims.push(selectedVerbatim);
                    setVerbastards(tempVerbatims);
                  }
                  
                  if (selectedVerbatim.verbaiter === profileId) {
                    tempVerbatims.push(selectedVerbatim);
                    setVerbatims(tempVerbatims);
                  }

                  //const mapB = selectedVerbatim.filter((item) => item.verbastard === profileId);
                  //let tempVerbatims2 = verbastards;
                  //tempVerbatims2 = tempVerbatims2.concat(mapB);
                  //setVerbastards(tempVerbatims2);
                  
                  /*if(selectedVerbatim.verbastard === profileId){
                    setVerbatims((verbastard) => [...verbastard, selectedVerbatim]);
                  }*/

                })
              }
            })
          }
        })
        
        //console.log("hi!");
        const userRef = ref(db, "Users/" + profileId);
        //console.log("hi!!");
        onValue(userRef, (snapshot) => {
          data = snapshot.val();
          //console.log("hi!!!");
          if (data) {
            let likedverbatims = data.likedverbatims || [];
            likedverbatims = likedverbatims.filter((postId) => postId !== undefined);
            setLikedPosts(likedverbatims);
            setUsername(data.username === undefined ? "NoName" : data.username)
          }
          //console.log("hi!!!!");
        })
        //console.log("hi!!!!!");
      } catch (error) {
        console.error('Error fetching verbatims: ', error);
      }
    }
    

    const fetchGroups = (item) => {
      return new Promise((resolve, reject) => {
        const dbref = ref(db, item);
        get(dbref).then((snapshot) => {
          if (snapshot.exists()) {
            data = snapshot.val();
            
            let verbatimsArray = Object.keys(data).map((key) => {
              return { id: key, val: data[key] };
            });
            resolve(verbatimsArray.map(item => item.val));

          } else {
            resolve({});
          }
        }).catch((error) => {
          reject(error);
        });
      });
    };

    const retGet = (item) => {
      return new Promise((resolve, reject) => {
        const dbref = ref(db, item);
        get(dbref).then((snapshot) => {
          if (snapshot.exists()) {
            data = snapshot.val();
            //newArray = data.filter(item => item !== undefined);
            //console.log(newArray);
            resolve(data);
          } else {
            resolve([]);
          }
        }).catch((error) => {
          reject(error);
        });
      });
    };




    const titleFriendButton = async () => {
      //console.log("1");
      const dbref = ref(db, 'Users/' + userId + "/friends");
      onValue(dbref, (snapshot) => {
        if (snapshot.exists()) {
          data=snapshot.val();
          //console.log("2");
          let verbatimsArray = Object.keys(data).map((key) => {
            return { id: key, value:data[key] };
          });
  
          let isFriend = false;
          let idFound = -1;
          verbatimsArray.forEach((friend) => {
            if (friend.value === profileId) {
              isFriend=true;
              idFound=friend.id;
            }
          });
  
          //const isFriend = verbatimsArray.some((friend) => friend.id === userId);
          
  
          if (isFriend) {
            setFriendButtonTitle("Remove Friend");
          } else {
            setFriendButtonTitle("Add Friend");
          }
        
        } else {
          setFriendButtonTitle("Add Friend");
        }
      }).catch((error) => {
        //console.log("6");
        console.error(error);
      });
    }

    


    const findUsername = async () => {
      //console.log("1");
      const dbref = ref(db, 'Users/' + profileId);
      onValue(dbref, (snapshot) => {
        if (snapshot.exists()) {
          setProfileUsername(snapshot.val().username);
        }
      }).catch((error) => {
        //console.log("6");
        console.error(error);
      });
    }

    findUsername();
    downloadUrl()
    .then((url) => {
      setProfilePicUrl(url);
    })
    .catch((error) => {
      console.log(error);
    });
    //getFriends(friendName);
    fetchVerbatims();
    titleFriendButton();
  }, []);

  const toggleFavorite = (postId) => {
    setVerbatims((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post
      )
    );
    setVerbastards((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post
      )
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard
  };
  
  const toggleLike = (postId) => {
    const postRef = ref(db, "Verbatims/" + postId)
    
    setLikedPosts((prevLikedPosts) => {
      let index = prevLikedPosts.indexOf(postId)
      if (index !== -1) {
        prevLikedPosts.splice(index, 1);
      }
      else {
        prevLikedPosts.push(postId)
      }
      return prevLikedPosts;
    });

    get(postRef).then((snapshot) => {
      post = snapshot.val();
      if (post) {
        const likedUsers = post.likes || [];
        const index = likedUsers.indexOf(profileId);
        if (index === -1) {
          likedUsers.push(profileId);
        } else {
          likedUsers.splice(index, 1);
        }

        const updates = {};
        updates['Verbatims/' + postId + '/likes'] = likedUsers;
        update(ref(db), updates);
      }
    }).catch((error) => {
      console.error('Error fetching verbatim: ', error);
    })

    const userRef = ref(db, "Users/" + profileId)

    get(userRef).then((snapshot) => {
      user = snapshot.val();
      if (user) {
        const likedPosts = user.likedverbatims || [];
        const index = likedPosts.indexOf(postId);
        if (index === -1) {
          likedPosts.push(postId);
        } else {
          likedPosts.splice(index, 1);
        }

        const updates = {};
        updates['Users/' + profileId + '/likedverbatims'] = likedPosts;
        update(ref(db), updates);
      }
    }).catch((error) => {
      console.error('Error fetching user: ', error);
    })
  }

  const addComment = (postId) => {
    if (commentText.trim()) {
      // setVerbatims((prevPosts) =>
      //   prevPosts.map((post) =>
      //     post.id === selectedPost.id ? { ...post, comments: [...post.comments, commentText] } : post
      //   )
      // );
      const commentsRef = ref(db, "Verbatims/" + postId + "/comments");
      const newCommentsRef = push(commentsRef);
      set(newCommentsRef, {
        comment: commentText,
        user: profileId,
        username: username
      });
      onValue(newCommentsRef, (snapshot) => {
        setCurrComments((prevComments) => [...prevComments, snapshot.val()]);
      })
      setCommentText('');
    }
  };

  const openModal = (postId) => {
    let post = verbatims.find((post) => post.id === postId);
    post = (post===undefined?verbastards.find((post) => post.id === postId):post);
    setSelectedPost(post);
    setCurrComments(Object.values(post.comments === undefined ? [] : post.comments));
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setShowModal(false);
  };

  const renderComment = ({ item }) => {
    if (!item) {
      return null;
    }
    return (<View>
      <Text style={styles.commentText}>{item.username}</Text>
      <Text style={styles.commentText}>{item.comment}</Text>
    </View>);
  };

  const displayFriends = () => {
    navigation.navigate('Friends', {userId: userId, profileId: profileId});
  }

  const renderDiscussionPost = ({ item }) => {
    let isLiked = likedPosts.includes(item.id);
    let groupName = null;
    if (item.groupName === null) {
      groupName = "No Group";
    }
    else {
      groupName = item.groupName;
    }
    return (
      <View style={styles.postContainer}>
        <View style={styles.userContainer}>
          <Image source={{uri: item.profilePic}} style={styles.profilePic} />
          <Text style={styles.username}>{item.verbaiterName} Said:</Text>
        </View>
        <Text>{item.timestamp}</Text>
        <Text>Submitted by: {item.verbastardName} | {groupName}</Text>
        <View style={styles.postTextContainer}>
          <Text style={styles.postText}>{item.post}</Text>
        </View>
        <TouchableOpacity
          style={[styles.favoriteButton, item.isFavorite && styles.favoriteButtonActive]}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={[styles.favoriteButtonText, item.isFavorite && styles.favoriteButtonTextActive]}>
            {item.isFavorite ? 'Unfavorite' : 'Favorite'}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.likeButton, isLiked && styles.likeButtonLiked]} onPress={() => toggleLike(item.id)}>
          <Text style={styles.likeButtonText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentButton} onPress={() => openModal(item.id)}>
          <Text style={styles.commentButtonText}>View Comments</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  };

  const toggleShowVerbatims = () => {
    setShowAllVerbatims(!showAllVerbatims);
  };

  const toggleShowVerbastards = () => {
    setShowAllVerbastards(!showAllVerbastards);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.profileName}>{profileUsername}</Text>

        {userId!==profileId && (
          <View style={styles.imageButton}>
            <Image source={{ uri: profilePicUrl }} style={styles.mainProfileImage} />
          </View>
        )}
        
        {userId===profileId && (
          <TouchableOpacity onPress={handleButtonPress} style={styles.imageButton}>
            <Image source={{ uri: profilePicUrl }} style={styles.mainProfileImage} />
          </TouchableOpacity>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={displayFriends} style={styles.belowProfileButton}>
              <Text style={styles.closeButtonText}>Friends</Text>
          </TouchableOpacity>
          {userId!==profileId && (
              <TouchableOpacity onPress={addFriendButton} style={styles.belowProfileButton}>
                <Text style={styles.closeButtonText}>{friendButtonTitle}</Text>
              </TouchableOpacity>
          )}
        </View>
        

        <Text style={styles.text}>Verbatims You Said</Text>
        
        <FlatList
          data={showAllVerbatims ? verbatims : verbatims.slice(0, 1)}
          renderItem={renderDiscussionPost}
          keyExtractor={(item,index) => index}
          contentContainerStyle={styles.listContainer}
          style={styles.scrollViewList}
        />
        {verbatims.length > 1 && 
          <TouchableOpacity onPress={toggleShowVerbatims} style={styles.showMoreButton}>
          <Text style={styles.showMoreButtonText}> {showAllVerbatims ? 'Show less' : 'Show more'} </Text>
          </TouchableOpacity>
        }

        <Text style={styles.text}>Verbatims You Submitted</Text>
        <FlatList
          data={showAllVerbastards ? verbastards : verbastards.slice(0, 1)}
          renderItem={renderDiscussionPost}
          keyExtractor={(item,index) => index}
          contentContainerStyle={styles.listContainer}
          style={styles.scrollViewList}
        />
        {verbastards.length > 1 && 
          <TouchableOpacity onPress={toggleShowVerbastards} style={styles.showMoreButton}>
          <Text style={styles.showMoreButtonText}> {showAllVerbastards ? 'Show less' : 'Show more'} </Text>
          </TouchableOpacity>
        }     

        {selectedPost && (
                <Modal visible={showModal} animationType="slide" transparent>
                  <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalPost}>{selectedPost.post}</Text>
                  <Text>Comments:</Text>
                  <FlatList
                      data={currComments}
                      renderItem={renderComment}
                      keyExtractor={(item, index) => index}
                      contentContainerStyle={styles.commentsContainer}
                  />
                  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? -120 : null}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Add a comment..."
                    onChangeText={(text) => setCommentText(text)}
                    value={commentText}
                    onSubmitEditing={() => addComment(selectedPost.id)}
                  />
                  </KeyboardAvoidingView>
                </View>
                </View>
              </Modal>
              )}
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4664D6',
    fontSize: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  imageButton: {
    justifyContent: 'center', // Center the image horizontally
    alignItems: 'center', // Center the image vertically
    paddingBottom: 15,
  },
  mainProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  showMoreButton: {
    backgroundColor: '#617FE8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  showMoreButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 700,
    paddingTop: 3,
    paddingBottom: 3,
  },
  backgroundImage: {
    position: 'relative',
    width: 200,
    height: 100,
  },
  scrollViewList: {
    width: 320,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 15,
  },
  postContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePic: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  postText: {
    fontSize: 16,
  },
  postTextContainer: {
    flex: 1,
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postText: {
    fontSize: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e1e1e1',
  },
  favoriteButtonText: {
    fontSize: 14,
    color: '#333',
  },
  favoriteButtonActive: {
    backgroundColor: '#ffcc00',
  },
  likeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e1e1e1',
  },
  likeButtonLiked: {
    backgroundColor: 'red',
  },
  likeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e1e1e1',
  },
  belowProfileButton: {
    backgroundColor: '#617FE8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 700,
    paddingTop: 3, 
    paddingLeft: 3,
    paddingBottom: 3,
    paddingRight: 3,
  },
  commentsHeading: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  commentList: {
    maxHeight: 200,
  },
  comment: {
    marginBottom: 8,
  },
  commentText: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  commentButtonText: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    height: '70%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  commentsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
  },
  belowProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
});

export default ProfileScreen;

/*import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from "react-native";

const ProfileScreen = ({ navigation }) => {
    return (
      <View>
        <Text>Profile Screen </Text>
      </View>
    );
    };

ProfileScreen.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ tintColor }) => (
    <Icon name="gear" size={24} color={tintColor} />
  ),
  tabBarAccessibilityLabel: 'Home Tab',
};

export default ProfileScreen*/