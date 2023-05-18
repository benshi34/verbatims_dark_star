import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [discussionPosts, setDiscussionPosts] = useState([]);

    useEffect(() => {
      // Simulated data for discussion posts
      const dummyData = [
        {
          id: 1,
          user: 'John',
          post: 'Wanna Fuck?',
          profilePic: require('../assets/kharn.jpg'),
          isFavorite: false,
          likes: 0,
        },
        {
          id: 2,
          user: 'Sarah',
          post: 'Ew wtf why would you say something like that? ',
          profilePic: require('../assets/kharn.jpg'),
          isFavorite: false,
          likes: 0,
        },
        {
          id: 3,
          user: 'Michael',
          post: 'I would like to fuck.',
          profilePic: require('../assets/kharn.jpg'),
          isFavorite: false,
          likes: 0,
        },
      ];
  
      setDiscussionPosts(dummyData);
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
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    };

    const renderDiscussionPost = ({ item }) => {
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
          <TouchableOpacity style={styles.likeButton} onPress={() => toggleLike(item.id)}>
            <Text style={styles.likeButtonText}>Like ({item.likes})</Text>
          </TouchableOpacity>
        </View>
      );
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Verbatims</Text>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  <FlatList
                  data={discussionPosts}
                  renderItem={renderDiscussionPost}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={styles.listContainer}
                  />
                </ScrollView>
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
    },
    username: {
      fontWeight: 'bold',
    },
    postText: {
      fontSize: 16,
    },
    favoriteButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#e6e6e6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    favoriteButtonText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#333',
    },
    favoriteButtonActive: {
      backgroundColor: '#ffcc00',
    },
    favoriteButtonTextActive: {
      color: '#fff',
    },
    likeButton: {
      marginTop: 8,
      padding: 8,
      borderRadius: 4,
      backgroundColor: '#e6e6e6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    likeButtonText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#333',
    },
    scrollContainer: {
      paddingBottom: 16,
    },
  });

export default HomeScreen