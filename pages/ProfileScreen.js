import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Button, KeyboardAvoidingView} from 'react-native';
import { Svg, SvgUri, Path } from 'react-native-svg';
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

        if (isFriend) {
          remove(ref(db, 'Users/' + userId + "/friends/"+idFound));
          removed=true;
        } else {
        }
      
      } else {
      }
    }).catch((error) => {
      //console.log("6");
      console.error(error);
    });


    if(!removed){
      const dbrefReq = ref(db, 'Users/' + profileId + "/friendrequests");
      get(dbrefReq).then((snapshot) => {
        if (snapshot.exists()) {
          data=snapshot.val();
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

          if (isFriend) {
            remove(ref(db, 'Users/' + profileId + "/friendrequests/"+idFound));
          } else {
            const newPostKey = push(child(ref(db), 'Users/' + profileId + "/friendrequests")).key;
            const updates = {};
            updates["/"+newPostKey] = userId;
            update(ref(db, 'Users/' + profileId + "/friendrequests"), updates);
          }
          
        } else {
          const updates = {};
          const newPostKey = push(child(ref(db), 'Users/' + profileId + "/friendrequests")).key;
          updates["/"+newPostKey] = userId;
          update(ref(db, 'Users/' + profileId + "/friendrequests"), updates);
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }




  useEffect(() => {
    // Simulated data for discussion posts

    const fetchVerbatims = async () => {
      try {
        
        const fetchGroupsAsync = async () => {
          const includedGroups = await fetchGroups('Users/' + profileId + "/groups");
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
                fetchVerbatimAsync(verbatimsArray[id]).then((selectedVerbatim) => {
                  if (selectedVerbatim.verbaiter === profileId) {
                    tempVerbatims.push(selectedVerbatim);
                    setVerbatims(tempVerbatims);
                  }
                  
                  if (selectedVerbatim.verbastard === profileId) {
                    tempVerbastards.push(selectedVerbatim);
                    setVerbastards(tempVerbastards);
                  }
                })
              }
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
    } else {
      groupName = item.groupName;
    }
    let numLikes = 0;
    if (item.likes !== undefined) {
      numLikes = item.likes.length;
    }
    let numComments = 0;
    if (item.comments !== undefined) {
      numComments = Object.keys(item.comments).length;
    }
    return (
      <View style={styles.postContainer}>
        <View style={styles.userContainer}>
          <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{item.verbaiterName} Said:</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>

        <View style={styles.postTextContainer}>
          <Text style={styles.postText}>"{item.post}"</Text>
        </View>
        <View style={styles.submittedByContainer}>
          <Text style={styles.submittedByText}>
            Submitted by: {item.verbastardName} | {groupName}
          </Text>
        </View>
        <View style={styles.favoriteButton}>
          <SvgFavoritedButton
            onPress={() => toggleFavorite(item.id)}
            isFavorite={item.isFavorite}
          />
        </View>
        <View style={styles.actionsContainer}>
          <SvgLikeButton
            onPress={() => toggleLike(item.id)}
            isLiked={isLiked}
            numLikes={numLikes}
          />
          <SvgCommentButton 
            onPress={() => openModal(item.id)} 
            numComments={numComments}
          />
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
        <View style={styles.headerView}>
          <Text style={styles.profileName}>{profileUsername}</Text>
        </View>

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

const SvgFavoritedButton = ({ onPress, isFavorite }) => {
  return (
    <TouchableOpacity style={styles.likeButtonContainer} onPress={onPress}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
      >
        <Path
          d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
          fill={isFavorite ? "#FFD600" : "#f5f5f5"}
          stroke={isFavorite ? "none" : "#AFAFAF"}
        />
      </Svg>
    </TouchableOpacity>
  );
};

const SvgLikeButton = ({ onPress, isLiked, numLikes}) => {
  return (
    <TouchableOpacity style={styles.likeButtonContainer} onPress={onPress}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="13"
        viewBox="0 0 14 13"
        fill="none"
      >
        <Path
          d="M10.7021 2.6004C10.532 2.20638 10.2866 1.84933 9.97978 1.54923C9.67273 1.24823 9.31069 1.00903 8.91338 0.844638C8.50139 0.673496 8.0595 0.585896 7.61338 0.586923C6.9875 0.586923 6.37686 0.75831 5.84619 1.08204C5.71924 1.15948 5.59863 1.24454 5.48438 1.33722C5.37012 1.24454 5.24951 1.15948 5.12256 1.08204C4.59189 0.75831 3.98125 0.586923 3.35537 0.586923C2.90469 0.586923 2.46797 0.673251 2.05537 0.844638C1.65674 1.00968 1.29746 1.24708 0.988965 1.54923C0.681734 1.84899 0.43631 2.20613 0.266602 2.6004C0.0901367 3.01046 0 3.44591 0 3.89405C0 4.31681 0.0863282 4.75733 0.257715 5.20548C0.401172 5.57999 0.606836 5.96847 0.869629 6.36075C1.28604 6.98155 1.85859 7.62901 2.56953 8.28536C3.74766 9.37335 4.91436 10.1249 4.96387 10.1554L5.26475 10.3483C5.39805 10.4334 5.56943 10.4334 5.70273 10.3483L6.00361 10.1554C6.05313 10.1236 7.21855 9.37335 8.39795 8.28536C9.10889 7.62901 9.68145 6.98155 10.0979 6.36075C10.3606 5.96847 10.5676 5.57999 10.7098 5.20548C10.8812 4.75733 10.9675 4.31681 10.9675 3.89405C10.9688 3.44591 10.8786 3.01046 10.7021 2.6004Z"
          fill={isLiked ? "red" : "#AFAFAF"}
        />
      </Svg>
      <Text
        style={[styles.likeButtonText, isLiked && styles.likeButtonLiked]}
      >
        {" "}
        {numLikes} Likes
      </Text>
    </TouchableOpacity>
  );
};

const SvgCommentButton = ({ onPress, numComments }) => {
  return (
    <TouchableOpacity style={styles.likeButtonContainer} onPress={onPress}>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <Path
          d="M7 9.5C8.8855 9.5 9.8285 9.5 10.414 8.914C11 8.3285 11 7.3855 11 5.5C11 3.6145 11 2.6715 10.414 2.086C9.8285 1.5 8.8855 1.5 7 1.5H5C3.1145 1.5 2.1715 1.5 1.586 2.086C1 2.6715 1 3.6145 1 5.5C1 7.3855 1 8.3285 1.586 8.914C1.9125 9.241 2.35 9.3855 3 9.449"
          stroke="#5570D6"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M7.00012 9.5C6.38212 9.5 5.70112 9.75 5.07962 10.0725C4.08062 10.591 3.58112 10.8505 3.33512 10.685C3.08912 10.52 3.13562 10.0075 3.22912 8.983L3.25012 8.75"
          stroke="#5570D6"
          stroke-width="2"
          stroke-linecap="round"
        />
      </Svg>
      <Text style={[styles.commentButtonText]}> {numComments} Comments</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileName: {
    fontSize: 39,
    fontWeight: "bold",
    color: "#617FE8",
    textAlign: 'center',
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
    width: 400,
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 20,
  },
  headerView: {
    paddingTop: 0,
    paddingBottom: 20,
    width: "100%",
    height: 130,
    backgroundColor: "white",
    elevation: 5,
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 15,
  },
  postContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginBottom: 16,
    borderRadius: 17,
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  profilePic: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  postText: {
    fontSize: 16,
    color: "#000",
    fontWeight: 700,
  },
  postTextContainer: {
    flex: 0,
    marginBottom: 4,
  },
  submittedByContainer: {
    marginHorizontal: 8,
  },
  submittedByText: {
    color: "#9A9A9A",
    fontSize: 10,
    fontWeight: 700,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestamp: {
    color: "#9A9A9A",
    fontSize: 8,
    fontStyle: "normal",
    fontWeight: 700,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  favoriteButtonText: {
    fontSize: 14,
    color: "#333",
  },
  favoriteButtonActive: {
    backgroundColor: "yellow",
  },
  likeButtonContainer: {
    flexDirection: "row",
  },
  likeButtonLiked: {
    color: "red",
  },
  likeButtonText: {
    fontSize: 10,
    fontWeight: 700,
    color: "#AFAFAF",
  },
  actionsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  commentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#e1e1e1",
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
    fontSize: 10,
    fontWeight: 700,
    color: "#617FE8",
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


