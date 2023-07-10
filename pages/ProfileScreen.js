import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Button, KeyboardAvoidingView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, onValue, update, remove, push } from "firebase/database";
import { app } from "../Firebase.js";
import { getStorage, ref as refStorage, uploadBytes, putFile, getMetadata, getDownloadURL } from "firebase/storage";
import { userId } from "./HomeScreen.js";


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

  const defaultRef = refStorage(storage, '1.jpg');

  const toggleImageVisibility = () => {
    setShowImage(!showImage);
    setButtonText(showImage ? 'Show More' : 'Show Less');
  };

  const toggleSubmittedImageVisibility = () => {
    setSubmittedShowImage(!submittedShowImage);
    setSubmittedButtonText(submittedShowImage ? 'Show More' : 'Show Less');
  };

  
  const downloadUrl = async () => {
    const defaultStorageRef = refStorage(storage, '1.jpg');
    const defaultUrl = await getDownloadURL(defaultStorageRef);
    const storageRef = refStorage(storage, String(profileId) + '.jpg');
    const url = await getDownloadURL(storageRef).catch((error) => {
      console.log(error);
    });
    setProfilePicUrl(url !== undefined ? url : defaultUrl);
  }  

  const handleButtonPress = async () => {
    try { 
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        const file = await uriToFile(result.uri);
        const uploadTask = uploadBytes(storageRef, file, metadata);
        uploadTask
        .then((snapshot) => {
          downloadUrl();
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


  const addFriendButton = () => {
    //console.log("1");
    const dbref = ref(db, 'Users/' + userId + "/friends");
    get(dbref).then((snapshot) => {
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
        } else {
          //console.log("4");
          
          const newPostKey = push(child(ref(db), 'Users/' + userId + "/friends")).key;
          const updates = {};
          updates["/"+newPostKey] = profileId;
          update(ref(db, 'Users/' + userId + "/friends"), updates);
        }
      
      } else {
        //console.log("5");
        const updates = {};
        const newPostKey = push(child(ref(db), 'Users/' + userId + "/friends")).key;
        updates["/"+newPostKey] = profileId;
        update(ref(db, 'Users/' + userId + "/friends"), updates);
      }
    }).catch((error) => {
      //console.log("6");
      console.error(error);
    });
  }




  useEffect(() => {
    // Simulated data for discussion posts

    const fetchVerbatims = async () => {
      try {
        const dbref = ref(db, "Verbatims");
        onValue(dbref, (snapshot) => {
          data = snapshot.val()
          if (data) {
            let verbatimsArray = Object.keys(data).map((key) => {
              return { id: key, ...data[key] };
            });
            const promises = verbatimsArray.map(async item => {
              const defaultStorageRef = refStorage(storage, '1.jpg');
              const defaultUrl = await getDownloadURL(defaultStorageRef);
              const storageRef = refStorage(storage, String(item.verbaiter) + '.jpg');
              const url = await getDownloadURL(storageRef).catch((error) => {
                console.log(error);
              });
              return { ...item, profilePic: url === undefined ? defaultUrl : url};
            })
            Promise.all(promises).then(verbatimsArray => {
              const mapC = verbatimsArray.filter((item) => item.verbaiter === profileId);
              setVerbatims(mapC);
              const mapB = verbatimsArray.filter((item) => item.verbastard === profileId);
              setVerbastards(mapB);
            })
          }
        })
        const userRef = ref(db, "Users/" + profileId);
        onValue(userRef, (snapshot) => {
          data = snapshot.val();
          if (data) {
            let likedverbatims = data.likedverbatims || [];
            likedverbatims = likedverbatims.filter((postId) => postId !== undefined);
            setLikedPosts(likedverbatims);
            setUsername(data.username === undefined ? "NoName" : data.username)
          }
        })
      } catch (error) {
        console.error('Error fetching verbatims: ', error);
      }
    }



    const profileIdSetter = async () => {
      const dbref = ref(db, 'Users/' + profileId + "/friends");
      get(dbref).then((snapshot) => {
        if (snapshot.exists()) {
          const updates = {};
          updates["/friends"] = snapshot.val()+" "+userId;

          update(ref(db, 'Users/' + userId), updates);

          /*console.log(snapshot.val());
          set(ref(db, 'Users/' + userId), {
            friends:snapshot.val()+" "+userId
          });*/
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }


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
    downloadUrl();
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

/*

{!showImage && (
                  <FlatList
                  data={discussionPosts}
                  renderItem={renderDiscussionPost}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.listContainer}
                  />
        )}

        */

        /*
        <Button title={buttonText} onPress={toggleImageVisibility} />
        
        <Button title={submittedButtonText} onPress={toggleSubmittedImageVisibility} />*/
        
        /*
        <TouchableOpacity onPress={handleButtonPress} style={styles.imageButton}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <Image source={require('../assets/kharn.jpg')} style={styles.image} />
          )}
        </TouchableOpacity>
        */

/*
const htref = 'https://firebasestorage.googleapis.com/v0/b/verbatims-4622f.appspot.com/o/1.jpg?alt=media&token=0b82c18e-9de4-4f37-ab86-ff2748decf86';  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={handleButtonPress} style={styles.imageButton}>
          {metadata && (
            <Image source={{ uri: htref }} style={styles.image} />
          )}
        </TouchableOpacity>
        */
            /*
          <TextInput
            style={styles.inputField}
            placeholder="Enter friend's name"
            onChangeText={setFriendName}
            value={friendName}
          />*/

  const toggleShowVerbatims = () => {
    setShowAllVerbatims(!showAllVerbatims);
  };

  const toggleShowVerbastards = () => {
    setShowAllVerbastards(!showAllVerbastards);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.text}>{profileUsername}</Text>



        <TouchableOpacity onPress={handleButtonPress} style={styles.imageButton}>
          <Image source={{ uri: profilePicUrl }} style={styles.image} />
        </TouchableOpacity>
        {userId!==profileId && (
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={addFriendButton} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{friendButtonTitle}</Text>
            </TouchableOpacity>
          </View>
        )}
        

        <Text style={styles.text}>Verbatims You Said</Text>
        
        <FlatList
          data={showAllVerbatims ? verbatims : verbatims.slice(0, 1)}
          renderItem={renderDiscussionPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          style={styles.scrollViewList}
        />
        {verbatims.length > 1 && 
          <Button title={showAllVerbatims ? 'Show less' : 'Show more'} onPress={toggleShowVerbatims} />}


        <Text style={styles.text}>Verbatims You Submitted</Text>
        <FlatList
          data={showAllVerbastards ? verbastards : verbastards.slice(0, 1)}
          renderItem={renderDiscussionPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          style={styles.scrollViewList}
        />
        {verbastards.length > 1 && 
          <Button title={showAllVerbastards ? 'Show less' : 'Show more'} onPress={toggleShowVerbastards} />}
        
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    marginTop: 0,
    marginLeft: 0,
    justifyContent: 'center', // Center the image horizontally
    alignItems: 'center', // Center the image vertically
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  backgroundImage: {
    position: 'relative',
    width: 200,
    height: 100,
  },
  scrollViewList: {
    width: 300,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
  username: {
    fontWeight: 'bold',
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
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
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
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