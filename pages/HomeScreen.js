import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Keyboard, KeyboardAvoidingView, Pressable, } from 'react-native';
import { Svg, SvgUri, Path } from 'react-native-svg';
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
      return (
        <View>
          <Image source={{uri: item.profilePic}} style={styles.profilePic} />
          <Text style={styles.commentUser}>{item.username}</Text>
          <Text style={styles.commentText}>{item.comment}</Text>
        </View>
      );
    };

    /*
    const SvgLikeButton = ({ onPress }) => {
      return (
        <TouchableOpacity onPress={onPress}>
          <Svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
            <Path 
              d="M13.6613 2.66409C13.4441 2.14276 13.1309 1.67033 12.7392 1.27326C12.3472 0.875002 11.8851 0.558512 11.3779 0.341001C10.852 0.114559 10.288 
                -0.0013468 9.71847 1.18067e-05C8.91954 1.18067e-05 8.14005 0.226778 7.46266 0.655113C7.3006 0.757578 7.14665 0.870121 7.0008 0.992743C6.85495 0.870121 
                6.701 0.757578 6.53894 0.655113C5.86155 0.226778 5.08206 1.18067e-05 4.28313 1.18067e-05C3.70783 1.18067e-05 3.15036 0.114235 2.62368 0.341001C2.11483 
                0.559368 1.65621 0.873481 1.26241 1.27326C0.870233 1.66989 0.556949 2.14242 0.340317 2.66409C0.115059 3.20665 0 3.7828 0 4.37575C0 4.93511 0.110198 5.51798 
                0.328973 6.11093C0.512096 6.60646 0.774626 7.12046 1.11008 7.6395C1.64162 8.4609 2.37249 9.31757 3.28 10.186C4.78388 11.6255 6.27317 12.62 6.33637 12.6603L6.72045 
                12.9156C6.8906 13.0281 7.10938 13.0281 7.27954 12.9156L7.66361 12.6603C7.72681 12.6183 9.21448 11.6255 10.72 10.186C11.6275 9.31757 12.3584 8.4609 12.8899 7.6395C13.2254 
                7.12046 13.4895 6.60646 13.671 6.11093C13.8898 5.51798 14 4.93511 14 4.37575C14.0016 3.7828 13.8865 3.20665 13.6613 2.66409ZM7.0008 11.5869C7.0008 11.5869 1.23162 7.75541 
                1.23162 4.37575C1.23162 2.66409 2.59775 1.27662 4.28313 1.27662C5.46776 1.27662 6.49519 1.96196 7.0008 2.96309C7.50641 1.96196 8.53385 1.27662 9.71847 1.27662C11.4039 1.27662 
                12.77 2.66409 12.77 4.37575C12.77 7.75541 7.0008 11.5869 7.0008 11.5869Z" 
              fill="#AFAFAF"
            />
          </Svg>
        </TouchableOpacity>
      );
    };
    */

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
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          
          <View style={styles.postTextContainer}>
            <Text style={styles.postText}>"{item.post}"</Text>
          </View>
          <Text style={styles.submittedText}>Submitted by: {item.verbastardName} | {groupName}</Text>
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
            <View style={styles.headerView}>
              <Text style={styles.header}>Verbatims</Text>
            </View>
              <FlatList
                data={verbatims}
                renderItem={renderDiscussionPost}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
              />
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
                        <Text style={styles.commentsHeadingText}>Comments</Text>
                      </View>
                      
                         <FlatList
                            data={currComments}
                            renderItem={renderComment}
                            keyExtractor={(item, index) => index}
                            contentContainerStyle={styles.commentsContainer}
                            style={styles.commentsBody}
                        />

                        <KeyboardAvoidingView
                          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                          style={styles.commentInputRect}
                        >
                        <View style={styles.textboxRec}>
                         <TextInput
                          style={styles.commentInput}
                          placeholder="Add a comment..."
                          placeholderTextColor="#616060"
                          onChangeText={(text) => setCommentText(text)}
                          value={commentText}
                          onSubmitEditing={() => addComment(selectedPost.id)}
                        />
                        </View>
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
      paddingTop: 45,
    },
    headerView: {
      alignItems: 'center',
    },
    header: {
      fontSize: 39,
      fontWeight: 400,
      marginBottom: 16,
      marginTop: 16,
      color: '#617FE8',
    },
    listContainer: {
      paddingBottom: 16,
      position: 'relative',
    },
    postContainer: {
      backgroundColor: '#f5f5f5',
      padding: 16,
      marginBottom: 16,
      borderRadius: 17,
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'relative',
    },
    userContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    timestamp: {
      color: '#9A9A9A',
      fontSize: 8, 
      fontStyle: 'normal',
      fontWeight: 700,
    },
    submittedText: {
      color: '#9A9A9A', 
      fontSize: 10,
      fontWeight: 700,
    },
    profilePic: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 8,
    },
    postTextContainer: {
      flex: 1,
      marginBottom: 0,
    },
    postText: {
      fontSize: 16,
      color: '#000',
      fontWeight: 700, 
    },
    username: {
      fontSize: 14,
      fontWeight: 'bold',
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
      //fontFamily: 'Gotham',
      fontWeight: 'bold',
      fontSize: 16, 
    },
    commentsBody: {
      paddingLeft: 16,
    },
    commentInputRect: {
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
      backgroundColor: '#D4D4D4',
      borderWidth: 1,
      borderColor: '#ccc',
      borderBottomEndRadius: 6,
      left: 0, 
      right: 0, 
      height: 80,
      bottom: 0,
      position: 'absolute',
      
    },
    textboxRec: {
      backgroundColor: '#FFFFFF',
      padding: 0,
      marginTop: 14,
      marginBottom: 11,
      borderRadius: 20,
    },
    commentInput: {
      flexShrink: 0,
      borderWidth: 3,
      borderColor: '#ccc',
      borderRadius: 20,
      padding: 8,
      color: '#616060',
      fontSize: 10,
      width: 324,
      height: 40,
    },
    commentList: {
      maxHeight: 200,
    },
    commentUser: {
      marginBottom: 3,
      fontWeight: 'bold',
      fontSize: 13, 
    },
    commentText: {
      marginBottom: 12,
      fontSize: 13,
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
      width: '100%',
      height: '60%',
      //paddingHorizontal: 16,
      paddingTop: 16,
      borderColor: '#AFAFAF',
      //borderWidth: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    commentsContainer: {
      flexGrow: 1,
      marginTop: 16,
      borderTopColor: '#ccc',
      paddingTop: 16, 
    },
  });

export default HomeScreen