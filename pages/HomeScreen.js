import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

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

const HomeScreen = ({ navigation }) => {
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
            <Text style={styles.header}>Verbatims</Text>
                <FlatList
                data={discussionPosts}
                renderItem={renderDiscussionPost}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                />
        </View>
    );
}
  
HomeScreen.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ tintColor }) => (
        <Icon name="home" size={24} color={tintColor} />
    ),
    tabBarAccessibilityLabel: 'Home Tab',
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
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
      flexDirection: 'row',
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

export default HomeScreen