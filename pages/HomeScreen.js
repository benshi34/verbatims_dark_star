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
  const [commentText, setCommentText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [username, setUsername] = useState("");
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
          data = snapshot.val();
          if (data) {
            let verbatimsArray = Object.keys(data).map((key) => {
              return { id: key, ...data[key] };
            });
            const promises = verbatimsArray.map(async (item) => {
              const defaultStorageRef = refStorage(storage, "1.jpg");
              const defaultUrl = await getDownloadURL(defaultStorageRef);
              const storageRef = refStorage(
                storage,
                String(item.verbaiter) + ".jpg"
              );
              const url = await getDownloadURL(storageRef).catch((error) => {
                console.log(error);
              });
              return {
                ...item,
                profilePic: url === undefined ? defaultUrl : url,
              };
            });
            Promise.all(promises).then((verbatimsArray) => {
              setVerbatims(verbatimsArray);
            });
          }
        });
        const userRef = ref(db, "Users/" + userId);
        onValue(userRef, (snapshot) => {
          data = snapshot.val();
          if (data) {
            let likedverbatims = data.likedverbatims || [];
            likedverbatims = likedverbatims.filter(
              (postId) => postId !== undefined
            );
            setLikedPosts(likedverbatims);
            setUsername(data.username === undefined ? "NoName" : data.username);
          }
        });
      } catch (error) {
        console.error("Error fetching verbatims: ", error);
      }
    };
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
    const postRef = ref(db, "Verbatims/" + postId);

    setLikedPosts((prevLikedPosts) => {
      let index = prevLikedPosts.indexOf(postId);
      if (index !== -1) {
        prevLikedPosts.splice(index, 1);
      } else {
        prevLikedPosts.push(postId);
      }
      return prevLikedPosts;
    });

    get(postRef)
      .then((snapshot) => {
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
          updates["Verbatims/" + postId + "/likes"] = likedUsers;
          update(ref(db), updates);
        }
      })
      .catch((error) => {
        console.error("Error fetching verbatim: ", error);
      });

    const userRef = ref(db, "Users/" + userId);

    get(userRef)
      .then((snapshot) => {
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
          updates["Users/" + userId + "/likedverbatims"] = likedPosts;
          update(ref(db), updates);
        }
      })
      .catch((error) => {
        console.error("Error fetching user: ", error);
      });
  };

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
        username: username,
      });
      onValue(newCommentsRef, (snapshot) => {
        setCurrComments((prevComments) => [...prevComments, snapshot.val()]);
      });
      setCommentText("");
    }
  };

  const openModal = (postId) => {
    const post = verbatims.find((post) => post.id === postId);
    setSelectedPost(post);
    setCurrComments(
      Object.values(post.comments === undefined ? [] : post.comments)
    );
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
        <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
        <Text style={styles.commentUser}>{item.username}</Text>
        <Text style={styles.commentText}>{item.comment}</Text>
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
        {/*<TouchableOpacity
            style={[styles.favoriteButton, item.isFavorite && styles.favoriteButtonActive]}
            onPress={() => toggleFavorite(item.id)}
          >
            <Text style={[styles.favoriteButtonText, item.isFavorite && styles.favoriteButtonActive]}>
              {item.isFavorite ? 'Unfavorite' : 'Favorite'}
            </Text>
          </TouchableOpacity>*/}
        <View style={styles.favoriteButton}>
          <SvgFavoritedButton
            onPress={() => toggleFavorite(item.id)}
            isFavorite={item.isFavorite}
          />
        </View>
        <View style={styles.actionsContainer}>
          {/*<TouchableOpacity style={[styles.likeButton, isLiked && styles.likeButtonLiked]} onPress={() => toggleLike(item.id)}>
            <Text style={styles.likeButtonText}>Like</Text>
          </TouchableOpacity>*/}
          <SvgLikeButton
            onPress={() => toggleLike(item.id)}
            isLiked={isLiked}
            numLikes={numLikes}
          />
          <Text> </Text>
          {/*<TouchableOpacity style={styles.commentButton} onPress={() => openModal(item.id)}>
            <Text style={styles.commentButtonText}>View Comments</Text>
          </TouchableOpacity>*/}
          <SvgCommentButton 
            onPress={() => openModal(item.id)} 
            numComments={numComments}
          />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#fff",
  },
  headerView: {
    paddingTop: 45,
    paddingBottom: 16,
    width: "100%",
    height: 110,
    backgroundColor: "#fff",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  header: {
    fontSize: 39,
    fontWeight: 400,
    color: "#617FE8",
  },
  listContainer: {
    position: "relative",
    paddingBottom: 330,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  userInfo: {
    margin: 0,
  },
  timestamp: {
    color: "#9A9A9A",
    fontSize: 8,
    fontStyle: "normal",
    fontWeight: 700,
  },
  submittedByContainer: {
    marginHorizontal: 8,
  },
  submittedByText: {
    color: "#9A9A9A",
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
    flex: 0,
    marginBottom: 4,
  },
  postText: {
    fontSize: 16,
    color: "#000",
    fontWeight: 700,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
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
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 14,
    color: "#333",
  },
  commentsHeading: {
    alignItems: "center",
    paddingBottom: 0,
  },
  commentsHeadingText: {
    //fontFamily: 'Gotham',
    fontWeight: "bold",
    fontSize: 16,
  },
  commentsBody: {
    paddingLeft: 16,
  },
  commentInputRect: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: "#D4D4D4",
    borderWidth: 1,
    borderColor: "#ccc",
    borderBottomEndRadius: 6,
    left: 0,
    right: 0,
    height: 80,
    bottom: 0,
    position: "absolute",
  },
  textboxRec: {
    backgroundColor: "#FFFFFF",
    padding: 0,
    marginTop: 14,
    marginBottom: 11,
    borderRadius: 20,
  },
  commentInput: {
    flexShrink: 0,
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 8,
    color: "#616060",
    fontSize: 10,
    width: 324,
    height: 40,
  },
  commentList: {
    maxHeight: 200,
  },
  commentUser: {
    marginBottom: 3,
    fontWeight: "bold",
    fontSize: 13,
  },
  commentText: {
    marginBottom: 12,
    fontSize: 13,
    fontWeight: "bold",
    color: "#AFAFAF",
  },
  commentButtonText: {
    fontSize: 10,
    fontWeight: 700,
    color: "#617FE8",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    height: "60%",
    //paddingHorizontal: 16,
    paddingTop: 16,
    borderColor: "#AFAFAF",
    //borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  commentsContainer: {
    flexGrow: 1,
    marginTop: 16,
    borderTopColor: "#ccc",
    paddingTop: 16,
  },
});

export default HomeScreen