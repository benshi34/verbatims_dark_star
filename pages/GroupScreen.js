import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getDatabase, ref, get, onValue } from "firebase/database";
import { app } from "../Firebase.js";

const GroupScreen = ({ navigation }) => {

  const [Groups, setGroups] = useState([]);

  const db = getDatabase(app);

  useEffect(() => {
    // Simulated data for discussion posts

    /*const dummyData = [
       {
        id: 1,
        name: 'Dark Star',
        message: 'One new message', //use database here
        profilePic: require('../assets/kharn.jpg'),
        timestamp: '7:11 PM'
      },
      {
        id: 2,
        name: 'Ben sucks I hate him so much',
        message: '10+ new messages',
        profilePic: require('../assets/kharn.jpg'),
        timestamp: '7:11 PM'
      },
    ];
  
      setGroups(dummyData);*/

      const fetchGroups = async () => {
        try {
          const dbref = ref(db, "Groups")
          onValue(dbref, (snapshot) => {
            data = snapshot.val()
            if (data) {
              const discussionPostsArray = Object.keys(data).map((key) => {
                return { id: key, ...data[key] };
              });
              setGroups(discussionPostsArray);
            }
          })
        } catch (error) {
          console.error('Error fetching groups: ', error);
        }
      }
      fetchGroups();

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
        <Text style={styles.timeStampText}>{item.timestamp}</Text>
        <View style={styles.circle}></View>
      </TouchableOpacity>
    );
  };

    return (
      <View style={styles.container}>
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
    fontSize: 20,
  },
  postText: {
    fontSize: 14,
    color: 'grey'
  },
  groupContainer: {
    flex: 1,
    flexDirection: 'row', // Arrange children in a row
    //backgroundColor: '#f5f5f5',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
    position: 'relative',
  },
  leftHalf: {
    flex: 1, // Take half of the available space
    //backgroundColor: '#f5f5f5', // Customize the left half's background color
  },
  rightHalf: {
    flexDirection: 'column', // Arrange children in a row
    flex: 4, // Take half of the available space
    //backgroundColor: '#F5F5F5', // Customize the right half's background color
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  timeStampContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  timeStampText: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: 'blue',
  },
  circle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'blue', // Set the desired background color for the circle
    paddingHorizontal: 12,
    paddingVertical: 6,
    bottom: 8,
    right: 8,
  },
});

export default GroupScreen