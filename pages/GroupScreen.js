import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const GroupScreen = ({ navigation }) => {
  // const [Groups, setGroups] = useState([]);

  const [Groups, setGroups] = useState([]);

  useEffect(() => {
    // Simulated data for discussion posts
    const dummyData = [
       {
        id: 1,
        name: 'Dark Star',
        message: 'One new message',
        profilePic: require('../assets/kharn.jpg'),
      },
      {
        id: 2,
        name: 'Ben sucks I hate him so much',
        message: '10+ new messages',
        profilePic: require('../assets/kharn.jpg'),
      },
    ];
  
      setGroups(dummyData);
    }, []);

  const renderGroups = ({ item }) => {
    return (
      <TouchableOpacity style={styles.groupContainer}>
        <View style={styles.leftHalf}>
        <Image source={item.profilePic} style={styles.profilePic} />
        </View>
        <View style={styles.rightHalf}>
          <Text style={styles.username}>{item.name}</Text>
          <Text style={styles.postText}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

    return (
      <View style={styles.container}>
      <Text style={styles.header}>Groups</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <FlatList
        data={Groups}
        renderItem={renderGroups}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        />
        </ScrollView>
    </View>
    );
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
    width: 40,
    height: 40,
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
  groupContainer: {
    flex: 1,
    flexDirection: 'row', // Arrange children in a row
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
    position: 'relative',
  },
  leftHalf: {
    flex: 1, // Take half of the available space
    backgroundColor: '#f5f5f5', // Customize the left half's background color
  },
  rightHalf: {
    flexDirection: 'column', // Arrange children in a row
    flex: 4, // Take half of the available space
    backgroundColor: '#F5F5F5', // Customize the right half's background color
  },
  scrollContainer: {
    paddingBottom: 16,
  },
});

export default GroupScreen