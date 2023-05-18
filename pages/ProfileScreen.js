import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, ImageBackground, FlatList } from 'react-native';

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
  const handleImagePress = () => {
    // Handle the button press event here
    console.log('Image button pressed!');
  };
  const [discussionPosts, setDiscussionPosts] = useState([]);
  useEffect(() => {
    // Simulated data for discussion posts
    const dummyData = [
      {
        id: 1,
        user: 'John',
        post: 'Hello, everyone! How is your day going?',
        profilePic: require('../assets/kharn.jpg'),
      },
      {
        id: 2,
        user: 'Sarah',
        post: 'Hey, John! My day is great. How about you?',
        profilePic: require('../assets/kharn.jpg'),
      },
      {
        id: 3,
        user: 'Michael',
        post: 'Hi, John and Sarah! I\'m having a good day too.',
        profilePic: require('../assets/kharn.jpg'),
      },
    ];

    setDiscussionPosts(dummyData);
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
      <TouchableOpacity onPress={handleImagePress} style={styles.imageButton}>
        <Image source={require('../assets/kharn.jpg')} style={styles.image} />
      </TouchableOpacity>
      <Text style={styles.text}>Verbatims You Said</Text>
                <FlatList
                data={discussionPosts}
                renderItem={renderDiscussionPost}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                />
      <Text style={styles.text}>Verbatims You Submitted</Text>
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
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
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