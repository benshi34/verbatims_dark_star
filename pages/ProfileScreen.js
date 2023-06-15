import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Button} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, onValue, update } from "firebase/database";
import { app } from "../Firebase.js";
import { getStorage, ref as refStorage, uploadBytes, putFile, getMetadata, getDownloadURL } from "firebase/storage";

const db = getDatabase(app);

const storage = getStorage();
const storageRef = refStorage(storage, '1.jpg');
const metadata = {
  contentType: 'image/jpeg',
};

const ProfileScreen = () => {
  const [discussionPosts, setDiscussionPosts] = useState([]);
  const [lessDiscussionPosts, setLessDiscussionPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [submittedShowImage, setSubmittedShowImage] = useState(false);
  const [buttonText, setButtonText] = useState('Show More');
  const [submittedButtonText, setSubmittedButtonText] = useState('Show More');
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [htref, setHtref] = useState('abcd');
  const [profileId, setProfileId] = useState(0);
  const [friendName, setFriendName] = useState('');
  //const htref = 'https://firebasestorage.googleapis.com/v0/b/verbatims-4622f.appspot.com/o/1.jpg?alt=media&token=11ea9825-a4e2-4a7b-97c1-c4ad1b1eaae2';  

  const toggleImageVisibility = () => {
    setShowImage(!showImage);
    setButtonText(showImage ? 'Show More' : 'Show Less');
  };

  const toggleSubmittedImageVisibility = () => {
    setSubmittedShowImage(!submittedShowImage);
    setSubmittedButtonText(submittedShowImage ? 'Show More' : 'Show Less');
  };

  
  const downloadUrl = async () => {
    getDownloadURL(storageRef )
    .then((url) => {
      setHtref(url)
    })
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
  
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
    const filename = uri.substring(uri.lastIndexOf('/') + 1);

    return new File([blob], filename, { type: blob.type });
  };

  const getFriends = async () => {
      const dbref = ref(db, 'Users/' + "1" + "/friends");
      get(dbref).then((snapshot) => {
        if (snapshot.exists()) {
          //console.log(Object.keys(snapshot.val()).length);
          const updates = {};
          //updates["/"+Object.keys(snapshot.val()).length] = friendName;
          updates["/"+Object.keys(snapshot.val()).length] = "1";


          update(ref(db, 'Users/' + "1" + "/friends"), updates);

          //console.log(snapshot.val());
          /*set(ref(db, 'Users/' + "1" + "\friends"), {
            friends:snapshot.val()+" 1"
          });*/
        } else {
          const updates = {};
          //updates["/"+"0"] = friendName;
          updates["/"+"0"] = "1";

          update(ref(db, 'Users/' + "1" + "/friends"), updates);
          //console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Simulated data for discussion posts
    const fetchDiscussionPosts = async () => {
      try {
        const dbref = ref(db, "Verbatims")
        onValue(dbref, (snapshot) => {
          data = snapshot.val()
          if (data) {
            const mapA = Object.keys(data).map((key) => {
              return { id: key, ...data[key] };
            });
            //console.log(mapA)
            const mapB = mapA.filter((item) => item.id === 128);
            setDiscussionPosts(mapB);
            setLessDiscussionPosts(mapB);
          }
        })
      } catch (error) {
        console.error('Error fetching discussion posts: ', error);
      }
    }

    const profileIdSetter = async () => {
      const dbref = ref(db, 'Users/' + profileId + "/friends");
      get(dbref).then((snapshot) => {
        if (snapshot.exists()) {
          const updates = {};
          updates["/friends"] = snapshot.val()+" 1";

          update(ref(db, 'Users/' + "1"), updates);

          /*console.log(snapshot.val());
          set(ref(db, 'Users/' + "1"), {
            friends:snapshot.val()+" 1"
          });*/
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }


    downloadUrl();
    //getFriends(friendName);
    fetchDiscussionPosts();
  }, []);

  const toggleFavorite = (postId) => {
    setDiscussionPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post
      )
    );
  };
  
  const toggleLike = (postId) => {
    setDiscussionPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isLiked: !post.isLiked} : post
      )
    );
  };

  const addComment = () => {
    if (commentText.trim()) {
      setDiscussionPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPost.id ? { ...post, comments: [...post.comments, commentText] } : post
        )
      );
      setCommentText('');
    }
  };

  const openModal = (postId) => {
    const post = discussionPosts.find((post) => post.id === postId);
    setSelectedPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setShowModal(false);
  };


  const renderDiscussionPost = ({ item }) => {
    const isLiked = item.isLiked ? styles.likeButtonLiked : null;

    return (
      <View style={styles.postContainer}>
        <View style={styles.userContainer}>
          <Image source={item.profilePic} style={styles.profilePic} />
          <Text style={styles.username}>{item.user}</Text>
        </View>
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
        <TouchableOpacity style={[styles.likeButton, isLiked]} onPress={() => toggleLike(item.id)}>
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
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={getFriends} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>


        <TouchableOpacity onPress={handleButtonPress} style={styles.imageButton}>
          <Image source={{ uri: htref }} style={styles.image} />
        </TouchableOpacity>

        <Text style={styles.text}>Verbatims You Said</Text>
        
        <FlatList
          data={discussionPosts}
          renderItem={renderDiscussionPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          style={styles.scrollViewList}
        />
        <Text style={styles.text}>Verbatims You Submitted</Text>
        <FlatList
          data={discussionPosts}
          renderItem={renderDiscussionPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          style={styles.scrollViewList}
        />
        {selectedPost && (
            <Modal visible={showModal} animationType="slide" transparent>
              <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              <Text style={styles.modalPost}>{selectedPost.post}</Text>

              <View style={styles.commentsContainer}>
                <Text style={styles.commentsHeading}>Comments:</Text>
                {selectedPost.comments.map((comment, index) => (
                  <Text key={index} style={styles.commentText}>{comment}</Text>
                ))}
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                onChangeText={(text) => setCommentText(text)}
                value={commentText}
                onSubmitEditing={addComment}
              />
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
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  imageButton: {
    marginTop: 50, // Add top margin for spacing
    marginLeft: 50, // Add top margin for spacing
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
    height: 50
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
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