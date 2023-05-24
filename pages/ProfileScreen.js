import React, { useEffect, useState } from 'react';
import {ScrollView,  View, Image, TouchableOpacity, Text, StyleSheet, ImageBackground, FlatList, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { app } from "../Firebase.js";

const db = getDatabase(app);

const dummyData = [
  {
    id: 1,
    user: 'John',
    post: 'Hello, everyone! How is your day going?',
  },
  {
    id: 2,
    user: 'Sarah',
    post: 'Hey, John! My day is great. How about you?',
  },
  {
    id: 3,
    user: 'Michael',
    post: 'Hi, John and Sarah! I\'m having a good day too.',
  },
];


const ProfileScreen = () => {
  const [discussionPosts, setDiscussionPosts] = useState([]);
  const [lessDiscussionPosts, setLessDiscussionPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [submittedShowImage, setSubmittedShowImage] = useState(false);
  const [buttonText, setButtonText] = useState('Show More');
  const [submittedButtonText, setSubmittedButtonText] = useState('Show More');

  const toggleImageVisibility = () => {
    setShowImage(!showImage);
    setButtonText(showImage ? 'Show More' : 'Show Less');
  };

  const toggleSubmittedImageVisibility = () => {
    setSubmittedShowImage(!submittedShowImage);
    setSubmittedButtonText(submittedShowImage ? 'Show More' : 'Show Less');
  };

  const performFirebaseTask = async () => {
    let list = new Map();

    const dbRef = ref(db);
    await get(child(dbRef, 'Verbatims/')).then((snapshot) => {
      if (snapshot.exists()) {
        list = snapshot.val();
        /*Object.keys(list).map((key) => {
          console.log(key);
          console.log(list[key]);
        })*/
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

    
    const dummyData = [];
    curid = 1;
    await Object.keys(list).map((key) => {
      //console.log(key+" "+list[key]);
      dummyData.push({ 
        id: curid,
        user: key,
        post: list[key],
        profilePic: require('../assets/kharn.jpg'), 
      });
      curid+=1;
    })
    setDiscussionPosts(dummyData);
    setLessDiscussionPosts(dummyData);
  };


  

  const handleButtonPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  useEffect(() => {
    performFirebaseTask();
  }, []);

  const renderDiscussionPost = ({ item }) => {
      return (
          <View style={styles.postContainer}>
              <View style={styles.userContainer}>
                  <Image source={item.profilePic} style={styles.profilePic} />
                  <Text style={styles.username}>{item.user}</Text>
              </View>
              <Text style={styles.postText}>{item.post}</Text>
          </View>
      );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={handleButtonPress} style={styles.imageButton}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          ) : (
            <Image source={require('../assets/kharn.jpg')} style={styles.image} />
          )}
        </TouchableOpacity>

        <Text style={styles.text}>Verbatims You Said</Text>
        {!showImage && (
                  <FlatList
                  data={lessDiscussionPosts}
                  renderItem={renderDiscussionPost}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.listContainer}
                  />
        )}
        {showImage && (
                  <FlatList
                  data={discussionPosts}
                  renderItem={renderDiscussionPost}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.listContainer}
                  />
        )}
        <Button title={buttonText} onPress={toggleImageVisibility} />
        <Text style={styles.text}>Verbatims You Submitted</Text>
        {!submittedShowImage && (
                  <FlatList
                  data={lessDiscussionPosts}
                  renderItem={renderDiscussionPost}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.listContainer}
                  />
        )}
        {submittedShowImage && (
                  <FlatList
                  data={discussionPosts}
                  renderItem={renderDiscussionPost}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.listContainer}
                  />
        )}
        <Button title={submittedButtonText} onPress={toggleSubmittedImageVisibility} />
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
    paddingBottom: 16,
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