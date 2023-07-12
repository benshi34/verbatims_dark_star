import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Keyboard, KeyboardAvoidingView, Pressable, } from 'react-native';
import { getDatabase, ref, get, set, onValue, update, push } from "firebase/database";
import { app } from "../Firebase.js";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { getStorage, ref as refStorage, getDownloadURL } from "firebase/storage";

const HomeScreen = ({ route }) => {
    const [verbatims, setVerbatims] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [likedPosts, setLikedPosts] = useState([]);
    const [username, setUsername] = useState('');
    const [currComments, setCurrComments] = useState([]);

    const { value } = route.params;

    const db = getDatabase(app);
    const userId = value;
    const storage = getStorage();

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
                setVerbatims(verbatimsArray);
              })
            }
          })
          const userRef = ref(db, "Users/" + userId);
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
      fetchVerbatims();
    }, []);

    const toggleFavorite = (postId) => {
      setVerbatims((prevPosts) =>
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
          const index = likedUsers.indexOf(userId);
          if (index === -1) {
            likedUsers.push(userId);
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

      const userRef = ref(db, "Users/" + userId)

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
          updates['Users/' + userId + '/likedverbatims'] = likedPosts;
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
        //     post.id === selectedPost.id ? { ...post, f [...post.comments, commentText] } : post
        //   )
        // );
        const commentsRef = ref(db, "Verbatims/" + postId + "/comments");
        const newCommentsRef = push(commentsRef);
        set(newCommentsRef, {
          comment: commentText,
          user: userId,
          username: username
        });
        onValue(newCommentsRef, (snapshot) => {
          setCurrComments((prevComments) => [...prevComments, snapshot.val()]);
        })
        setCommentText('');
      }
    };

    const openModal = (postId) => {
      const post = verbatims.find((post) => post.id === postId);
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
        <Text style={styles.commentUser}>{item.username}</Text>
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
    
    return (
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <Text style={styles.header}>Verbatims</Text>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <FlatList
                data={verbatims}
                renderItem={renderDiscussionPost}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                />
              </ScrollView>
              {selectedPost && (
                
                  <Modal 
                    visible={showModal} 
                    animationType="slide" 
                    transparent
                  >
                      <Pressable 
                        onPress={(event) => event.target == event.currentTarget && setShowModal(false)}
                        style={styles.modalContainer}
                      >
                      <View style={styles.modalContent}>
                        <View style={styles.commentsHeading}>
                          <Text style={styles.commentsHeadingText}>x Comments</Text>
                        </View>
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
                    </Pressable>
                </Modal>
              
              )}
      </TouchableWithoutFeedback>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
      paddingTop: 40,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    listContainer: {
      paddingBottom: 16,
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
    profilePic: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
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
      alignItems: 'center',
      paddingBottom: 0,
    },
    commentsHeadingText: {
      fontFamily: 'Gotham',
      fontWeight: 'bold',
      fontSize: 12, 
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
    commentUser: {
      flexDirection: 'row',
      marginBottom: 3,
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: 10, 
    },
    commentText: {
      flexDirection: 'row',
      marginBottom: 12,
      alignItems: 'center',
      fontSize: 10,
      fontWeight: 'bold', 
      color: '#AFAFAF'
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
      borderRadius: 31,
      width: '100%',
      height: '60%',
      paddingHorizontal: 16,
      paddingTop: 16,
      borderColor: '#000000',
      borderWidth: 1,
    },
    commentsContainer: {
      marginTop: 16,
      borderTopColor: '#ccc',
      paddingTop: 16, 
    },
  });

export default HomeScreen